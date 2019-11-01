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

// eab361efa1b15ec1ba5961e50dca5e30b1be47a0f4489b6bb22b6131811a9572
// 8458c8986de343b967928631ec00b8bd7b4bff4c32ee10d8a085975ee922abc0

// 99554f606d45ee3dba7695ecf592ac2210f7ba7718dbc5a781925c0aae3764a1
// 15b5b36dbafdf787955393f5b90f736d18d825e17dd5a8a8f17596fc1b2fc607