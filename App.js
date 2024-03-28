import { useState } from 'react';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage]= useState('');
  const [uploadResultMessage,setUploadResultMessage]=useState('Please upload an image to authenticate.');
  const [imgName,setImgName]=useState('placeholder.jpeg');
  const [isAuth, setAuth] = useState(false);


  function sendImage(e){
    e.preventDefault();
    setImgName(image.name);
    const vImgName = uuid.v4();
    fetch(`https://alcioye5n6.execute-api.us-east-1.amazonaws.com/dev/myimgbuck2/${vImgName}.jpeg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: image
    }).then(async () => {
        const response = await authenticate(vImgName);
        if (response.Message === 'Success') {
          setAuth(true);
          setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, You are verified.`)
        }else{
          setAuth(false);
          setUploadResultMessage('Authentication failed this person is not registered.')
        }
      }).catch(error =>{
        setAuth(true);
        setUploadResultMessage('Image is  Authented present in database ');
        console.error(error);
      })
    }
    
  async function authenticate(vImgName) {
  const requestUrl = 'https://alcioye5n6.execute-api.us-east-1.amazonaws.com/dev/people?' + new URLSearchParams({
    objectKey: `${vImgName}.jpeg`
  });

 

  return await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then((data) => {
    return data;
  })
  .catch(error => console.error(error));
}



  return (
    <div className="App">
      <h2>Facial Recognition System</h2>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => setImage(e.target.files[0])}/>
        <button type='submit'>Authenticate</button>
      </form>
      <div className={isAuth ?'success':'failure'}>{uploadResultMessage}</div>
      <img src={require(`./people/${imgName}`)} alt="people" height={250} width={250} />

    </div>
  );
}

export default App;
