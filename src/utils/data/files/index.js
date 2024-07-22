import axios from "axios";
export const submitFiles = async(formData)=>{
   try {
      const response = await axios.post('https://out.ridgecrestfg.com/jobs/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log('Files uploaded successfully:', response.data);
      return response.status; // Return the response status

    } catch (err) {
      console.error('Error uploading files:', err);
    }

}