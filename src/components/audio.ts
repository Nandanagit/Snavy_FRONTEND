"use client";

import apiClient from "../types/axios";

export default async function Audio() {
    const response = await apiClient.post("/text-for-audio");
    console.log(response.data);

    const speech = await apiClient.post("/to-speech");
    return speech.data;
}



