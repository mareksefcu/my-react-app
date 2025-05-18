export async function createCat(data) {
  try {
    const response = await fetch("http://localhost:8000/category/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Chyba při vytváření kategorie:", errorData);
      throw new Error(errorData.message || `Chyba při vytváření kategorie: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function createZap(zapisekData) {
  try {
    const response = await fetch("http://localhost:8000/zapisek/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zapisekData),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Získání JSON zprávy o chybě
      console.error("Chyba při vytváření zápisku:", errorData);
      throw new Error(errorData.message || `Chyba při vytváření zápisku: ${response.status}`); // Použití zprávy ze serveru
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Chyba ve createZap:", error);
    throw error; // Propaguj chybu dál
  }
}

export const fetchCategories = async () => {
  try {
    const response = await fetch(`http://localhost:8000/category/list`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Chyba při načítání kategorií:", errorData);
      throw new Error(errorData.message || `Chyba při načítání kategorií: ${response.status}`);
    }
    const data = await response.json(); // Await the JSON parsing
    return data;
  } catch (error) {
    console.error("Chyba ve fetchCategories:", error);
    throw error;
  }
};

export const fetchZaps = async () => {
  try {
    const response = await fetch('http://localhost:8000/zapisek/list');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch zápisky: ${response.status}`);
    }
    const data = await response.json();
    console.log("fetchZaps() data:", data);
    if (!Array.isArray(data.itemList)) {
      console.error("Error: fetchZaps() did not return an array.  Returning an empty array instead.");
      return [];
    }
    return data.itemList;
  } catch (error) {
    console.error('Error fetching zápisky:', error);
    throw error;
  }
};

export const download = async (zapisek) => {
  try {
    const response = await fetch('http://localhost:8000/zapisek/download', { // Replace with your actual endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Or whatever content type your backend expects
      },
      body: JSON.stringify(zapisek),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chyba při generování PDF:", errorText);
      throw new Error(`Chyba při generování PDF: ${response.status} - ${errorText}`);
    }

    // IMPORTANT: Use .blob() to handle the PDF data
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const updateZapisek = async (id, updatedData) => {
  try {
    // Log incoming data for debugging
    console.log('Incoming update data:', updatedData);

    // Ensure all required fields are present and properly formatted
    const requiredFields = ['id', 'name', 'details', 'categoryName', 'categoryId'];
    const missingFields = requiredFields.filter(field => !updatedData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Ensure all data is properly formatted and trimmed
    const payload = {
      id: updatedData.id.toString().trim(),
      name: updatedData.name.toString().trim(),
      details: updatedData.details.toString().trim(),
      categoryName: updatedData.categoryName.toString().trim(),
      categoryId: updatedData.categoryId.toString().trim()
    };

    // Validate ObjectId format (24 hex characters)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(payload.id) || !objectIdRegex.test(payload.categoryId)) {
      throw new Error('Invalid ObjectId format');
    }

    // Log outgoing payload for debugging
    console.log('Outgoing payload:', payload);

    const response = await fetch(`http://localhost:8000/zapisek/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // First try to parse the response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse server response:', parseError);
      throw new Error('Invalid response format from server');
    }

    // Log the complete response for debugging
    console.log('Server response:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });

    if (!response.ok) {
      // Construct a detailed error message
      const errorMessage = data.message || data.error || `Server error: ${data.code || response.status}`;
      console.error('Server error:', {
        status: response.status,
        message: errorMessage,
        details: data
      });
      throw new Error(errorMessage);
    }

    // Validate the response data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from server');
    }

    // Validate required fields in response
    const requiredResponseFields = ['_id', 'name', 'details', 'categoryName', 'categoryId'];
    const missingResponseFields = requiredResponseFields.filter(field => !data[field]);
    if (missingResponseFields.length > 0) {
      console.error('Invalid server response - missing fields:', missingResponseFields);
      throw new Error('Invalid response data from server');
    }

    // Log successful response
    console.log('Update successful:', data);
    return data;
  } catch (error) {
    // Add context to the error
    const enhancedError = new Error(`Failed to update zápisek: ${error.message}`);
    enhancedError.originalError = error;
    console.error(`Error updating zápisek with ID ${id}:`, error);
    throw enhancedError;
  }
};

export const deleteZap = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/zapisek/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete zápisek: ${response.status}`);
    }
    return response.json(); // Or handle success response as needed
  } catch (error) {
    console.error(`Error deleting zápisek with ID ${id}:`, error);
    throw error;
  }
};
