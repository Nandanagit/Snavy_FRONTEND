"use client";

import apiClient from "../types/axios";

export default async function subtitles() {
    const response = await apiClient.post("/subtitles");
    return response.data;
}