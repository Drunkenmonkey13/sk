import axios from 'axios';
import { useEffect, useState } from 'react';

function PortalDetailsPage() {
  const [details, setDetails] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/portal-details/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }).then(response => {
      setDetails(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Portal Details</h2>
      <p>Total Files: {details.total_files}</p>
      <p>Files Uploaded By You: {details.files_uploaded_by_you}</p>
      <pre>{JSON.stringify(details.file_types, null, 2)}</pre>
    </div>
  );
}

export default PortalDetailsPage;
