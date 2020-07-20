document.addEventListener('DOMContentLoaded', function() {
  //Create variable to track the current mailbox, initially inbox.
  current_mailbox = 'inbox';
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  //Function to send composed email
  document.querySelector('#compose-view').onsubmit = () => {
    console.log("Submit Detected.")
    //Extracting form data
    let recipients = document.querySelector('#compose-recipients').value;
    let subject = document.querySelector('#compose-subject').value;
    let body = document.querySelector('#compose-body').value;
    //Logging data to console for debugging
    console.log(`Detected new email: Recipients: ${recipients}, Subject: ${subject}, Body: ${body}. Successful data collection.`);
    //Sending data to database
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      //Return result
      console.log(result);
      if (result.message === "Email sent successfully.") {
        //Redirect to sent mail if success
        load_mailbox('sent');
      } else {
        alert(result.error);
      }
    });
    return false;
}
  //When email tab is clicked, show the email.
  document.querySelectorAll(".email").forEach(element => {
    element.onclick = () => {
      let id = this.dataset.id;
      fetch(`/emails/${id}`)
      .then(response => response.json())
      .then(result => {
        //Return result
        console.log(result);
        //Change state to "read"
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        })
        //Show the contents of the email
        load_email(id);
      });
    }
  });
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function reply_email(data) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';


  // Clear out composition fields and disable some fields
  document.querySelector('#compose-recipients').value = data.sender;
  document.querySelector('#compose-recipients').disabled = true;
  subject = data.subject;
  if (subject.includes("Re:")) {
    document.querySelector('#compose-subject').value = subject
  } else {
    document.querySelector('#compose-subject').value = `Re: ${subject}`;
  }
  document.querySelector('#compose-subject').disabled = true;
  document.querySelector('#compose-body').value = `On ${data.timestamp} ${data.sender} said: ${data.body}|\n
  `
}

function load_mailbox(mailbox) {
  current_mailbox = mailbox;
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#single-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Show emails in the mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(result => {
    //return result
    console.log(result);
    const emails = result;
    //Display each email
    for (email in emails) {
      let object = emails[email];
      const post = document.createElement('table');
      //Gives the email a class so it can be viewed when clicked
      post.className = "email"
      post.style.border = "2px solid black";
      post.style.width = "100%"
      //Creates a boolean representing whether the email is read
      const boolRead = object.read;
      console.log(`Read: ${boolRead}`)
      if (boolRead) {
        post.style.backgroundColor="lightgray";
      } else {
        post.style.backgroundColor="whitesmoke";
      }
      //Assigns an ID to each email
      post.dataset.id = object.id;
      //Set post's innerHTML
      //Set the sender
      const sender = document.createElement('td');
      sender.innerHTML = `<strong>${object.sender}</strong>`;
      //Set the subject
      const subject = document.createElement('td');
      subject.innerHTML = `Subject: ${object.subject}`
      //Set the timestamp
      const timestamp = document.createElement('td');
      timestamp.style.textAlign = "right";
      timestamp.style.color = "darkgray";
      timestamp.innerHTML = `${object.timestamp}`;
      //Open button
      let buttonshell = document.createElement('td');
      const button = document.createElement('button');
      button.className = "btn btn-sm btn-outline-primary";
      button.innerHTML = "Open"
      buttonshell.appendChild(button);
      //Add the four elements to the post
      post.append(sender);
      post.append(subject);
      post.append(timestamp);
      post.append(buttonshell);
      //Apply change to DOM
      document.querySelector('#emails-view').append(post);
      //Click detector
      button.onclick = () => {
        console.log("click detected");
        console.log(object);
        load_email(object);
      }
    }
  })
}
function load_email(data) {
  //Debugging info
  console.log(data)
  //Clear emails.
  document.querySelector('#single-email').innerHTML = '';
  //Show email and hide all other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-email').style.display = 'block';

  //Create an element for the email's data (sender, subject etc.)
  head = document.createElement('div');
  //Populate that data
  head.innerHTML = `<strong>From: </strong>${data.sender}<br>
  <strong>To: </strong>${data.recipients}<br>
  <strong>Subject: </strong>${data.subject},<br>
  <strong>Timestamp: </strong>${data.timestamp}`;
  //Create a button to reply with
  let reply = document.createElement('button');
  reply.className = 'reply btn btn-sm btn-outline-primary';
  reply.innerHTML = 'Reply';
  console.log(current_mailbox);
  if (current_mailbox == 'sent') {
    reply.style.display = 'none';
  } else {
    reply.style.display = 'block';
  }
  //Create a button to archive
  let archive = document.createElement('button');
  archive.className = 'archive btn btn-sm btn-outline-primary';
  if (data.archived) {
    archive.innerHTML = 'Unarchive';
  } else {
    archive.innerHTML = 'Archive';
  }
  //If the email is sent, hide the archive button
  console.log(current_mailbox);
  if (current_mailbox == 'sent') {
    archive.style.display = 'none';
  } else {
    archive.style.display = 'block';
  }
  //Create divider
  let divider = document.createElement('hr');
  //Display body of email
  let body = document.createElement('p');
  const raw_text = data.body;
  //If the email is a reply, split it by the '|' character
  if (raw_text.includes('|')) {
    const processed_text = raw_text.split('|');
    const original = processed_text[0];
    const newtext = processed_text[1];
    body.innerHTML = `<i>${original}</i><br><hr>${newtext}`; 
  } else {
    body.innerHTML = raw_text;
  }
  //Store the DOM as a variable for efficiency
  let email = document.querySelector('#single-email');
  //Add changes to the DOM
  email.append(head);
  email.append(archive);
  email.append(divider);
  email.append(body);
  email.append(reply);
  //Archiving emails
  archive.onclick = () => {
    if (data.archived) {
      fetch(`/emails/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: false,
        })
      })
      .then(
        load_mailbox("inbox")
      )
    } else {
      fetch(`/emails/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: true,
        })
      })
      .then(
        load_mailbox("inbox")
      )
    }
  }
  reply.onclick = () => {
    reply_email(data);
  }
}