import { NextResponse } from 'next/server';

// API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const players = searchParams.getAll('player');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const team = searchParams.get('team');
    const skill = searchParams.get('skill');
    const period = searchParams.get('period');

    // Build query parameters for backend
    const queryParams = new URLSearchParams();
    if (players && players.length > 0) {
      players.forEach(p => queryParams.append('player', p));
    }
    if (role) queryParams.append('role', role);
    if (status) queryParams.append('status', status);
    if (team) queryParams.append('team', team);
    if (skill) queryParams.append('skill', skill);
    if (period) queryParams.append('period', period);

    // Fetch data from backend
    const response = await fetch(`${API_BASE_URL}/dashboard/raids?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      console.error('Backend dashboard endpoint failed:', response.status, response.statusText);
      throw new Error(`Backend request failed: ${response.status} ${response.statusText}`);
    }

    // Check if response is empty
    const text = await response.text();
    if (!text || text.trim() === '') {
      throw new Error('Empty response from backend');
    }

    // Parse JSON with error handling
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', text.substring(0, 500)); // Log first 500 chars
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Dashboard API error:', error);
    
    // Return error response instead of mock data
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data',
        message: error.message 
      },
      { status: 500 }
    );
  }
}


