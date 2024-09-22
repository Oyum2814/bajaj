import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer';

interface ApiResponse {
  is_success: boolean;
  user_id: string;
  email?: string;
  roll_number?: string;
  numbers?: string[];
  alphabets?: string[];
  highest_lowercase_alphabet?: string[];
  file_valid?: boolean;
  file_mime_type?: any;
  file_size_kb?: any;
  operation_code?: number;
}

const userId = 'john_doe_17091999'; // Sample user ID
const email = 'john@xyz.com'; // Sample email
const rollNumber = 'ABCD123'; // Sample roll number

// Utility function to decode and validate base64 file string
const validateBase64File = (base64: string | undefined) => {
  if (!base64) return { valid: false, mimeType: null, size: null };

  try {
    const buffer = Buffer.from(base64, 'base64');
    const sizeKB = (buffer.length / 1024).toFixed(2);
    const mimeType = 'application/octet-stream'; // Default MIME type

    return { valid: true, mimeType, size: sizeKB };
  } catch (error) {
    return { valid: false, mimeType: null, size: null };
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'POST') {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ is_success: false, user_id: userId });
    }

    const numbers = data.filter((item: string) => !isNaN(Number(item)));
    const alphabets = data.filter((item: string) => /^[a-zA-Z]$/.test(item));
    const lowercaseAlphabets = data.filter((item: string) => /^[a-z]$/.test(item));
    const highestLowercase = lowercaseAlphabets.length > 0
      ? [lowercaseAlphabets.sort().reverse()[0]]
      : [];

    const { valid: file_valid, mimeType: file_mime_type, size: file_size_kb } = validateBase64File(file_b64);

    return res.status(200).json({
      is_success: true,
      user_id: userId,
      email,
      roll_number: rollNumber,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercase,
      file_valid,
      file_mime_type,
      file_size_kb
    });
  } else if (req.method === 'GET') {
    return res.status(200).json({
      operation_code: 1,
      is_success: true,
      user_id: userId
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
