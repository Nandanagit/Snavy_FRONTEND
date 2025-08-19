"use client";

import apiClient from "../types/axios";

export default async function GetSubtitles() {
    const response = await apiClient.get("/get-subtitles");
    console.log("Subtitles:", response.data);
    return response.data;
}