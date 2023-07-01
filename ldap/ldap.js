const ldap = require('ldapjs');

const ldapClient = ldap.createClient({
    url: 'ldap://192.168.100.200', // Replace with your domain controller's address
  });
  
 exports.login = (req,res)=>{
    const username = req.body.username+"@nibbanksc.com"; // Replace with the user's username
    const password =req.body.password; // Replace with the user's password
    
    ldapClient.bind(username, password, (bindErr) => {
      if (bindErr) {
       console.error('LDAP bind error:', bindErr);
        // return res.status(404).send({ message: "Invalid credentials." });// error
       return false;
      }
  
      console.log('User authenticated successfully.');
      ldapClient.unbind();
      return true;
    });
  
  }
  