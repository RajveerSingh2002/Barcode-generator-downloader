import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import JsBarcode from "jsbarcode";
import "./App.css";

function App() {
  const { register, handleSubmit, watch } = useForm();
  const barcodeRef = useRef(null);
  const [error, setError] = useState(null);
  const svgRef = useRef(null);


  const validateBarcode = (text, format) => {
    switch (format) {
      case "ean13":
        return /^\d{13}$/.test(text) ? null : "EAN-13 requires 13 digits";
      case "ean8":
        return /^\d{8}$/.test(text) ? null : "EAN-8 requires 8 digits";
      case "ean5":
        return /^\d{5}$/.test(text) ? null : "EAN-5 requires 5 digits";
      case "ean2":
        return /^\d{2}$/.test(text) ? null : "EAN-2 requires 2 digits";
      case "upc":
        return /^\d{12}$/.test(text) ? null : "UPC-A requires 12 digits";
      case "code39":
        return /^[0-9A-Z\-.\s$\/+%]+$/.test(text) ? null : "Invalid characters for Code 39";
      case "itf14":
        return /^\d{14}$/.test(text) ? null : "ITF-14 requires 14 digits";
      case "msi":
        return /^\d+$/.test(text) ? null : "MSI requires only digits";
      case "pharmacode":
        return /^\d{1,6}$/.test(text) ? null : "Pharmacode requires 1-6 digits";
      default:
        return null; // For code128 and other formats without specific restrictions
    }
  };

  const onSubmit = (data) => {
    console.log(data)
    console.log(barcodeRef)
    const { barcodeText, barcodeFormat } = data;
    const validationError = validateBarcode(barcodeText, barcodeFormat);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (barcodeRef.current) {
        JsBarcode(barcodeRef.current, barcodeText, { format: barcodeFormat });
        setError(null); // Clear error if barcode generation is successful
      }
    } catch (e) {
      setError(`Error generating barcode: ${e.message}`);
    }
  };

  useEffect(() => {
    try {
      if (barcodeRef.current) {
        JsBarcode(barcodeRef.current, "123456789012", { format: "code128" });
      }
    } catch (e) {
      setError(`Error initializing barcode: ${e.message}`);
    }
  }, []);


  useEffect(() => {
    if (svgRef.current) {
    JsBarcode(svgRef.current, '123456789012', { format: 'CODE128' });
    }
  }, []);

  
  // ------old code note works --------- //

  
  // const downloadSVG = () => {
  //   const svg = svgRef.current;
  //   const serializer = new XMLSerializer();
  //   const svgString = serializer.serializeToString(svg);
  //   const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  //   const svgUrl = URL.createObjectURL(svgBlob);
    
  //   const downloadLink = document.createElement('a');
  //   downloadLink.href = svgUrl;
  //   downloadLink.download = 'barcode.svg';
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //   document.body.removeChild(downloadLink);
  // };

  const downloadSVG = () => {
    const svg = barcodeRef.current;
    if (svg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'barcode.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    }
  };


  return (
    <div className="App">
      <h1>Barcode Generator</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
      
        <label htmlFor="barcodeText">Barcode Text:</label>
        <input
          id="barcodeText"
          {...register("barcodeText", { required: true })}
        />
        <label htmlFor="barcodeFormat">Barcode Format:</label>
        <select
          id="barcodeFormat"
          {...register("barcodeFormat", { required: true })}
        >
          <option value="code128">Code 128</option>
          <option value="ean13">EAN-13</option>
          <option value="ean8">EAN-8</option>
          <option value="ean5">EAN-5</option>
          <option value="ean2">EAN-2</option>
          <option value="upc">UPC-A</option>
          <option value="code39">Code 39</option>
          <option value="itf14">ITF-14</option>
          <option value="msi">MSI</option>
          <option value="pharmacode">Pharmacode</option>
        </select>
        <button type="submit">Generate Barcode</button>
      </form>
      {error && <p className="error">{error}</p>}
      <svg ref={barcodeRef}></svg>
      <button className="download_button" onClick={downloadSVG}>Download SVG</button>
    </div>
  );
}

export default App;