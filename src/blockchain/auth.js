import pcl from 'postchain-client';
import blockchain from './blockchain';

const auth = (function () {
  let currentUser = {};

  const register = async username => {
    try {
      const user = pcl.util.makeKeyPair();
      const { pubKey, privKey } = user;
      const rq = blockchain.getGtx().newTransaction([pubKey]);
      rq.addOperation('register', pubKey, username);
      rq.sign(privKey, pubKey);

      await rq.postAndWaitConfirmation();

      return await login(privKey.toString('hex'));
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  const loginFromSession = async () => {
    const session = sessionStorage.getItem('userLogin');
    if (session) await auth.login(session);
  }

  const login = async privKeyAsText => {
    try {
      const privKey = Buffer.from(privKeyAsText, 'hex');
      const pubKey = pcl.util.createPublicKey(privKey);
      const pubKeyAsText = pubKey.toString('hex');
      const { id, username } = await blockchain.getGtx().query("get_user", {
        user_pubkey: pubKeyAsText
      });

      currentUser = {
        id,
        username,
        pubKey,
        privKey
      };

      sessionStorage.setItem('userLogin', privKeyAsText);

      return {
        username,
        pubKey: pubKeyAsText,
        privKey: privKeyAsText
      };
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  const logout = () => {
    currentUser = {};
    sessionStorage.removeItem('userLogin');
  }

  const isLoggedIn = () => !!currentUser.privKey;

  const getCurrentUser = () => ({ ...currentUser });

  return {
    register,
    login,
    loginFromSession,
    logout,
    isLoggedIn,
    getCurrentUser
  }
})();

export default auth;

// 1c0ec4c890f6c444df33979f11214001699cd60e1c5d6bd63a68eb9bcbb0c7f8
// c7f85e1360e32a6b128f09f957e2e50f7d571a949d96055e0209e8301c10042d