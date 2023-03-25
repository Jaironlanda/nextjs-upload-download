import axios from "axios"
import { useState, useEffect } from "react"
import { saveAs } from 'file-saver';

export default function Home() {
  const [isUpload, setUpload] = useState()
  const [fileList, setFileList] = useState()
  // const [download, setDownload] = useState()

  const handleUpload = async (event) => {
    event.preventDefault()

    console.log(isUpload)
    await axios.post('http://localhost:8000/api/v1/', { file: isUpload }, {
      headers: {
        "Content-Type": "multipart/form-data"
      }}).then((res)=> {

        console.log(res.data)
    }).catch((err)=> {
        console.log(err)
    })
  }
  
  const downloadFile = async (id, filename) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/d1?id=${id}`, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
  
  const listUploadedFile = async () => {
    await axios.get('http://localhost:8000/api/v1/list').then((res) => {
      setFileList(res.data)
      console.log(res.data)
    }).catch((res) => {
      console.log(res)
    })
  }

  useEffect(() => {
    listUploadedFile()
  }, [])
  return (
    <>
    <h2>Single File Upload</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(v)=> setUpload(v.target.files[0])}/>
        <input type="submit" value="Upload File"/>
      </form>
      <p>Download file from server</p>
      <ul>
        {fileList && fileList.map((v, k) => (
          <li key={k}>{v.filename} | <button onClick={() => downloadFile(v.file_id, v.filename)}>Download</button></li>
        ))}
      </ul>
    </>
  )
}
