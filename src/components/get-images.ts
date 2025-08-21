"use client";

import apiClient from "../types/axios";

export default async function GetImages() {
    const response = await apiClient.get("/get-images");
    console.log("Images:", response.data);
    return response.data;
}