import pcl from 'postchain-client';
import { gtx } from './blockchain';
import crypto from 'crypto';

export const createChannel = (admin, channelName) => {
  const pubKey = pcl.util.toBuffer(admin.pubKey);
  const privKey = pcl.util.toBuffer(admin.privKey);
  const rq = gtx.newTransaction([pubKey]);
  rq.addOperation("create_channel", pubKey, channelName);
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const postMessage = (user, channelName, message) => {
  const pubKey = pcl.util.toBuffer(user.pubKey);
  const privKey = pcl.util.toBuffer(user.privKey);
  const rq = gtx.newTransaction([pubKey]);
  rq.addOperation("post_message", channelName, pubKey, message, crypto.randomBytes(32));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const inviteUser = (existingUser, newUserPubKey, startAmount) => {
  const pubKey = pcl.util.toBuffer(existingUser.pubKey);
  const privKey = pcl.util.toBuffer(existingUser.privKey);
  const rq = gtx.newTransaction([pubKey]);
  rq.addOperation("register_user", pubKey, pcl.util.toBuffer(newUserPubKey), parseInt(startAmount));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const inviteUserToChat = (existingUser, channel, newUserPubKey) => {
  const pubKey = pcl.util.toBuffer(existingUser.pubKey);
  const privKey = pcl.util.toBuffer(existingUser.privKey);
  const rq = gtx.newTransaction([pubKey]);
  rq.addOperation("add_channel_member", pubKey, channel, pcl.util.toBuffer(newUserPubKey));
  rq.sign(privKey, pubKey);
  return rq.postAndWaitConfirmation();
}

export const getBalance = (user) => {
  return gtx.query("get_balance", {
    user_pubkey: user.pubKey
  });
}

export const getChannels = (user) => {
  return gtx.query("get_channels", {
    user_pubkey: user.pubKey
  });
}

export const getMessages = (channel) => {
  return gtx.query("get_last_messages", { channel_name: channel });
}

export const getLastMessage = (channelName) => {
  return gtx.query("get_last_message", {
    channel_name: channelName
  });
}