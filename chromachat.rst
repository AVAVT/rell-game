.. _chromachat:

Chroma Chat
===========

In this section we will write the code for a public chat.

Requirements
~~~~~~~~~~~~

The requirements we set are the following:

* There is one admin with an amount of tokens automatically assigned (say 1000000)
* The admin is the first person that registers themselves on the dapp
* Any registered user can register a new user and transfer some tokens to her, after having burned 100 tokens as a fee
* Users are identified by their public key
* Channels are streams of messages belonging to the same topic (which is specified in the name of the channel, e.g. "showerthoughts", where you can send messages with the thoughts you had under the shower).
* Registered users can create channels
* When a new channel is created, only the creator is within the group. She can add any *existing* users. This operation costs 1 token.


Class definition
~~~~~~~~~~~~~~~~

The structure of it will be:

::

  class user { key pubkey; }

  class channel {
    key name;
    admin: user;
  }

  class channel_member { key channel, member: user; }

  class message {
    key channel, timestamp;
    index posted_by: user;
    text;
  }

  class balance {
    key user;
    mutable amount: integer;
  }

Let's analyse it:

User
    As said, user is solely identified by her public key

Channel
    Channels are identified by the name (which ideally reflects the topic of the channel itself) and the user who created it. Note that two channels cannot have the same name (``key``) and that an user can be admin of multiple channels.

Message
    One message has the text and reference of the user who sent it. Additionally, the channel and timestamp of publication is recorded. Note that ``key channel, timestamp`` means that only one message can be sent within a channel at given timestamp (but of course several messages on different channels can be recorded at single timestamp).

Balance
    This is kind of self explanatory: one user has an amount of tokens. Tokens can be spent (or more in general transfered), for this reason the field is marked as ``mutable``.

Operations
~~~~~~~~~~

Init
----

To initialize the module, we need to have at least one registered user. We don't want the user to call this function once the admin is set (i.e. we don't want users to change the admin). To prevent such event, we create an operation called ``init`` which verified that no users are registered and, in case of positive response, creates a new admin.

::

  operation init (founder_pubkey: pubkey) {
    require( (user@*{} limit 1).len() == 0 );
    val founder = create user (founder_pubkey);
    create balance (founder, 1000000);
  }

The operation receives a public key as input (note that it does not verify that signer of the transaction is the same specified in input field ``founder_pubkey``, meaning you can specify a different public key).

The interesting point is ``require( (user@*{} limit 1).len() == 0 );``. Here we retrieve a lists of users with a limit of 1: we get the first user in the table. If there is no user, it will return an empty list. Indeed we check its length and if it's 0 we can proceed in running the operation since there are no users registered.

In the third and fourth line the founder user is created and 1000000 tokens are given to her.

Decrease balance (Function)
---------------------------

For convenience we create a function to decrease a user's balance. We write it because we don't want to duplicate our checks and potentially create bugs.

::

  function decrease_balance (user, deduct_amount: integer) {
    require( balance@{user}.amount >= deduct_amount);
    update balance@{user} (amount -= deduct_amount);
  }


Register a new user
-------------------

As, said, registered users should be allowed to add new users, with a fee of 100 tokens as specified in ``val registration_cost = 100``. We then verify that the signer exists, decrease their balance, create the new user and transfer to him a certain positive amount of tokens.

::

  operation register_user (
     existing_user_pubkey: pubkey,
     new_user_pubkey: pubkey,
     transfer_amount: integer
  ) {
    require( is_signer(existing_user_pubkey) );
    val registration_cost = 100;
    val existing_user = user@{existing_user_pubkey};
    require( transfer_amount > 0 );
    decrease_balance(existing_user, transfer_amount + registration_cost);
    val new_user = create user (new_user_pubkey);
    create balance (new_user, transfer_amount);
  }


Create a new channel
--------------------

Registered users can create new channels. Given the public key and the name of the channel, we simply have to verify that she is actual registered user, receive the fee, create the channel (if it already exists, the create command will fail since the name is a ``key``) and add that user as chat member.

::

  operation create_channel ( admin_pubkey: pubkey, name) {
    require( is_signer(admin_pubkey) );
    val admin = user@{admin_pubkey};
    decrease_balance(admin, 100);
    val channel = create channel (admin, name);
    create channel_member (channel, admin);
  }


Add user to channel
-------------------

The admin of a channel (the one who created the channel) can add another user after having paid a fee of 1 token.

So we check once again that the signer is the ``admin_pubkey`` specified, we decrease the admin balance of 1 token, and we add a new user to the channel via ``channel_member``.

::

  operation add_channel_member (admin_pubkey: pubkey, channel_name: name, member_pubkey: pubkey) {
    require( is_signer(admin_pubkey) );
    val admin_usr = user@{admin_pubkey};
    decrease_balance(admin_usr, 1);
    val channel = channel@{channel_name, .admin==user@{admin_pubkey}};
    create channel_member (channel, member=user@{member_pubkey});
  }


Post a new message
-------------------

People in a channel will love to share their opinions. They can do so with the ``post_message`` operation where a signer ``is_signer(pubkey)`` can post a message in the channel ``val channel = channel@{channel_name};``
he is registered into ``require( channel_member@?{channel, member} );`` after the payment of a 1 token fee. Note the 4th input parameter nop is not used. We will see why later in this section.

::

  operation post_message (channel_name: name, pubkey, message: text, nop: byte_array) {
    require( is_signer(pubkey) );
    val channel = channel@{channel_name};
    val member = user@{pubkey};
    require( channel_member@?{channel, member} );
    decrease_balance(member, 1);
    create message (channel, member, text=message, op_context.last_block_time);
  }



Queries
~~~~~~~

It is useful to write data into a database in a distributed fashion, although writing would be meaningless without the ability to read.

Query all channels where a user is registered
---------------------------------------------

Getting the channels one user is registered into is simple, selecting from ``channel_member`` with the given user's public key.

::

  query get_channels(user_pubkey: text) {
    return channel_member@*{.member==user@{byte_array(user_pubkey)}}.channel.name;
  }


Other simple queries
--------------------

Likewise we can get the balance from one user.

::

  query get_balance(user_pubkey: text) {
    return balance@{user@{byte_array(user_pubkey)}}.amount;
  }


Retrieve the last message written in a chat, for a channel preview for example. Please note the use of ``limit`` in order to optimize the query.

::

  query get_last_message(channel_name: name) {
    return message@?{channel@{channel_name} } (text = .text, posted_by = .posted_by.pubkey, -sort timestamp = .timestamp) limit 1;
  }


And the messages sent in one channel sorted from the newest to the oldest.

::

  query get_last_messages(channel_name: name) {
    return message@*{ channel@{channel_name} }
        ( text = .text, posted_by = .posted_by.pubkey, -sort timestamp = .timestamp );
  }


Run it
~~~~~~

Assuming we have the ``docker-compose.yml`` file and we brought it up, we can simply:

* Browse to ``localhost:30000``
* Create a new module
* Paste the above code in the ``code`` section (You can find the full code `here <https://bitbucket.org/snippets/chromawallet/GeaEar>`_).
* Remove all the tests

::

  <test>
    <block>
    </block>
  </test>

* Click ``Run tests``
* When the tests are passed, click on ``Run Node``

Congratulations! You should now have a running node.

Client side
~~~~~~~~~~~

At this stage we should have a running node with your *freshly made* module.

What about interface it with a classy JS based application?

Well to do it we need the client package, called ``postchain-client``

::

   const pcl = require('postchain-client');
   const crypto = require('crypto');

Then we need to declare the address of the REST server (which is ran by the node, default is ``7740``) and the blockchainRID of the blockchain (in the dev-preview, this is already set to ``78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3`` and the number of sockets (5).

We then get an istance of GTX Client, via ``gtxClient.createClient`` and giving the rest object and blockchainRID in input. Last parameters is an empty list of operation (this is needed if you don't use Rell language, in fact, you can also code a module with standard SQL or as a proper kotlin/java module).

::

  const rest = pcl.restClient.createRestClient("http://localhost:7740/", '78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3', 5)
  const gtx = pcl.gtxClient.createClient(
      rest,
      Buffer.from(
          '78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3',
          'hex'
      ),
      []
  );



Create and send a transaction with the init operation
-----------------------------------------------------

First thing we probably want is to register and create the admin, we do so calling the ``init`` function.

::

  function init(adminPUB, adminPRIV) {
    const rq = gtx.newTransaction([adminPUB]);
    rq.addOperation('init', adminPUB);
    rq.sign(adminPRIV, adminPUB);
    return rq.postAndWaitConfirmation();
  }

The first thing we do is to declare a new transaction and that it will be signed by admin private key (we provide the public key, so the node can verify the veracity of transaction.

We add the operation called ``init`` and we pass as input argument the admin public key. We then sign the transaction with the private key (we specify the public key in order to correlate which private key refers to which public key in case of multiple signatures).

Finally we send the transaction to the node via the method ``postAndWaitconfirmation`` which returns a promise and resolves once it is confirmed.

Given the following keypair, we can create the admin.

::

  const adminPUB = Buffer.from(
      '031b84c5567b126440995d3ed5aaba0565d71e1834604819ff9c17f5e9d5dd078f',
      'hex'
  );
  const adminPRIV = Buffer.from(
      '0101010101010101010101010101010101010101010101010101010101010101',
      'hex'
  );

  init(adminPUB, adminPRIV);


Create other operations
------------------------

We can also create a new channel, post a message, invite a user to dapp, invite a user in a channel

::

  function createChannel(admin, channelName) {
      const pubKey = pcl.util.toBuffer(admin.pubKey);
      const privKey = pcl.util.toBuffer(admin.privKey);
      const rq = gtx.newTransaction([pubKey]);
      rq.addOperation("create_channel", pubKey, channelName);
      rq.sign(privKey, pubKey);
      return rq.postAndWaitConfirmation();
  }

  function postMessage(user, channelName, message) {
      const pubKey = pcl.util.toBuffer(user.pubKey);
      const privKey = pcl.util.toBuffer(user.privKey);
      const rq = gtx.newTransaction([pubKey]);
      rq.addOperation("post_message", channelName, pubKey, message, crypto.randomBytes(32));
      rq.sign(privKey, pubKey);
      return rq.postAndWaitConfirmation();
  }


  function inviteUser(existingUser, newUserPubKey, startAmount) {
      const pubKey = pcl.util.toBuffer(existingUser.pubKey);
      const privKey = pcl.util.toBuffer(existingUser.privKey);
      const rq = gtx.newTransaction([pubKey]);
      rq.addOperation("register_user", pubKey, pcl.util.toBuffer(newUserPubKey), parseInt(startAmount));
      rq.sign(privKey, pubKey);
      return rq.postAndWaitConfirmation();
  }

  function inviteUserToChat(existingUser, channel, newUserPubKey) {
      const pubKey = pcl.util.toBuffer(existingUser.pubKey);
      const privKey = pcl.util.toBuffer(existingUser.privKey);
      const rq = gtx.newTransaction([pubKey]);
      rq.addOperation("add_channel_member", pubKey, channel, pcl.util.toBuffer(newUserPubKey));
      rq.sign(privKey, pubKey);
      return rq.postAndWaitConfirmation();
  }

Although there is really nothing critical in these functions, there are few things worth noting:

* We expect public and private keys in ``hex`` format, and we convert them to Buffer with ``pcl.util.toBuffer(admin.pubKey);``
* In order to protect the system from replay attacks, the blockchain does not accept transactions which hash is equal to an already existing transaction. This means that an user is not allowed to write the same message twice in a channel since if at day one he writes "hello" the transaction will be something like ``rq.addOperation("post_message", the_channel, user_pub, "hello");``, when he will write 'hello' a second time the transaction will be the same and therefore rejected. To solve this problem we add some random bytes via ``crypto.randomBytes(32)``, and create a different transaction hash.

Querying the blockchain from the client side
--------------------------------------------

Previously we wrote the queries on blockchain side. Now we need to query from the dapp. To do so we use the previously mentioned ``postchain-client`` package.

::

  // Rell query, reported here for easy look up
  // query get_balance(user_pubkey: text) {
  // return balance@{user@{byte_array(user_pubkey)}}.amount;
  //}

  function getBalance(user) {
    return gtx.query("get_balance", {
            user_pubkey: user.pubKey
        });
  }

As you can see everything is contained into ``gtx.query``: the first argument is the query name in the rell module, and the second argument is the name of the expected attribute in the query itself wrapped in an object. The name of the object is the one specified in module and the value, of course, the value we want to send. Please note that ``buffer`` values must before be converted into hexadecimal strings.

Other queries:

::

  function getChannels(user) {
    return gtx.query("get_channels", {
            user_pubkey: user.pubKey
        });
  }

  function getMessages(channel) {
      return gtx.query("get_last_messages", {channel_name: channel});
  }

  function getLastMessage(channelName) {
      return gtx.query("get_last_message", {
          channel_name: channelName
      });
  }
