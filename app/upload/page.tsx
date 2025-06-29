"use client";

import { useState } from "react";
import * as exifr from 'exifr';

export default function UploadPage() {
  const [altText, setAltText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // exif
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imageDate, setImageDate] = useState<Date | null>(null);
  const [cameraModel, setCameraModel] = useState("");
  const [lensModel, setLensModel] = useState("");
  const [iso, setIso] = useState("");
  const [shutterSpeed, setShutterSpeed] = useState("");
  const [aperture, setAperture] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("alt_text", altText);
    formData.append("file", imageFile);


    setIsSubmitting(true);
    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed.");
      }

      alert("Upload successful!");
      setAltText("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
    console.log("submitted!")
  };

  const extractExifData = async (file: File | null) => {
    // Read the file into a buffer
    if (file == null) {
      alert("image file not valid");
      return;
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    function exposureTimeToFraction(exposureTime: number): string {
      if (exposureTime >= 1) {
        // If exposure time is 1 second or more, just return as seconds
        return exposureTime.toFixed(1) + "s";
      }
      const denominator = Math.round(1 / exposureTime);
      return `1/${denominator}`;
    }


    // Extract EXIF metadata
    const exifData = await exifr.parse(buffer, { gps: true })
    .then(output => {
      console.log(output);
      const {
        latitude,
        longitude,
        Model: cameraModel,
        LensModel: lensModel,
        ExposureTime: shutterSpeed,
        ISO: iso,
        FNumber: aperture,
        DateTimeOriginal: date,
      } = output;
      console.log("exposureTime: 1/" + (1/Number(shutterSpeed)).toString())
      if (latitude != null) setLatitude(latitude.toString());
      if (longitude != null) setLongitude(longitude.toString());
      if (cameraModel != null) setCameraModel(cameraModel);
      if (lensModel != null) setLensModel(lensModel);
      if (shutterSpeed != null) setShutterSpeed(exposureTimeToFraction(Number(shutterSpeed)))
      if (iso != null) setIso(iso.toString());
      if (aperture != null) setAperture(`f/${aperture}`);
      if (date != null) setImageDate(new Date(date)); // Convert to JS Date object
    })
    console.log(exifData)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-semibold text-center mb-6">Upload</h1>
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt={altText || "Preview"}
            height={200}
            className="flex justify-center mb-4 rounded "
          />
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Description"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
              extractExifData(file);
            }}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="date"
            value={imageDate ? imageDate.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const date = new Date(e.target.value);
              setImageDate(isNaN(date.getTime()) ? null : date);
            }}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Camera Model"
            value={cameraModel}
            onChange={(e) => setCameraModel(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Lens Model"
            value={lensModel}
            onChange={(e) => setLensModel(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="ISO"
            value={iso}
            onChange={(e) => setIso(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Shutter Speed"
            value={shutterSpeed}
            onChange={(e) => setShutterSpeed(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Aperture"
            value={aperture}
            onChange={(e) => setAperture(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
          >
            {isSubmitting ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  )
}
