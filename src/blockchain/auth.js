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

// 54325a3d56f44f51cde194e4aec9b134b5df1716511e36eb27d2f27e24b7606e
// 9d95c18a1a59545c815d8bcf07fd9fde0fae5e863ea82c7ee26cd2ef1673bf87