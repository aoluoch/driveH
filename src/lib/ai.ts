/**
 * AI-assisted car listing generation via OpenAI.
 * NOTE: This calls OpenAI directly from the browser (admin-only).
 * For production, proxy these requests through an Appwrite Function or server.
 */
import OpenAI from 'openai'
import type { AIGeneratedCar } from '../types'

function getClient() {
  const key = import.meta.env.VITE_OPENAI_API_KEY as string
  if (!key) throw new Error('VITE_OPENAI_API_KEY is not set in .env')
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true })
}

const SCHEMA = `Return a JSON object with ONLY these keys:
title (string), brand (string), model (string), year (number),
fuelType (one of: Petrol|Diesel|Electric|Hybrid|CNG),
transmission (one of: Automatic|Manual),
engine (string, e.g. "2.5L 4-Cylinder"),
condition (one of: New|Used|Certified Pre-Owned),
description (string, 3-4 compelling sentences),
features (array of 8-10 feature strings, e.g. ["Apple CarPlay","Heated Seats"]).
Return ONLY the JSON object – no markdown, no extra text.`

export async function generateFromName(carName: string): Promise<AIGeneratedCar> {
  const openai = getClient()
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: `Generate a detailed car marketplace listing for: "${carName}".\n${SCHEMA}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })
  const content = response.choices[0].message.content
  if (!content) throw new Error('Empty response from OpenAI')
  return JSON.parse(content) as AIGeneratedCar
}

export async function generateFromImage(
  imageBase64: string,
  mimeType: string,
): Promise<AIGeneratedCar> {
  const openai = getClient()
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this car image and generate a detailed marketplace listing.\n${SCHEMA}`,
          },
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${imageBase64}` },
          },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })
  const content = response.choices[0].message.content
  if (!content) throw new Error('Empty response from OpenAI')
  return JSON.parse(content) as AIGeneratedCar
}
