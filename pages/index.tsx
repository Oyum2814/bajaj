import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';

const IndexPage = () => {
  const [jsonInput, setJsonInput] = useState<string>(''); // Stores user input JSON
  const [error, setError] = useState<string>(''); // Error message for invalid JSON
  const [responseData, setResponseData] = useState<any>(null); // Stores response from API
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // Stores dropdown selections

  // Handle JSON input change
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    setError(''); // Clear error on change
  };

  // Handle dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(options);
  };

  // Validate JSON and call API
  const handleSubmit = async () => {
    try {
      // Parse and validate JSON
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data) throw new Error('Invalid JSON format');

      // Call the backend API
      const response = await axios.post('/api/bhfl', parsedJson);
      setResponseData(response.data);
      setError(''); // Clear error on success
    } catch (err) {
      console.log(err);
      setError('Invalid JSON or failed to fetch data');
    }
  };

  // Filter response based on selected options
  const filteredResponse = () => {
    if (!responseData) return null;

    const filtered: any = {};
    if (selectedOptions.includes('Alphabets')) filtered.alphabets = responseData.alphabets;
    if (selectedOptions.includes('Numbers')) filtered.numbers = responseData.numbers;
    if (selectedOptions.includes('Highest Lowercase Alphabet')) filtered.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;

    return filtered;
  };

  return (
    <>
      <Head>
        {/* Set the page title to the roll number */}
        <title>ABCD123</title>
      </Head>

      <div style={{ padding: '20px' }}>
        <h1 className="font-bold text-xl">JSON Input Processor</h1>
        
        <textarea
          rows={6}
          style={{ width: '100%' }}
          placeholder='Enter JSON data'
          value={jsonInput}
          onChange={handleJsonChange}
          className="border-solid border-black"
        ></textarea>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button className="bg-black text-white px-4 py-2 rounded-[9px]" onClick={handleSubmit}>Submit</button>

        {/* Show multi-select dropdown if response exists */}
        {responseData && (
          <>
            <div >
              <h2 className="font-bold mt-8">Select Filters:</h2>
              <select className="flex flex-col" multiple onChange={handleDropdownChange} style={{ width: 'auto' }}>
                <option className="bg-gray-300 px-4 py-2 m-2" value="Alphabets">Alphabets</option>
                <option className="bg-gray-300 px-4 py-2 m-2" value="Numbers">Numbers</option>
                <option className="bg-gray-300 px-4 py-2 m-2" value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
              </select>
            </div>
          </>
        )}

        {/* Render filtered response */}
        {responseData && (
          <div style={{ marginTop: '20px' }}>
            <h2>Filtered Response:</h2>
            <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  );
};

export default IndexPage;
