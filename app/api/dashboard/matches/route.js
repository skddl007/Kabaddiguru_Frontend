import { NextResponse } from 'next/server';


// Reverse mapping for frontend to database (now 1:1 mapping)
const REVERSE_TEAM_MAPPING = {
  'BB': 'BB',
  'JP': 'JP',
  'BW': 'BW',
  'DD': 'DD',
  'GG': 'GG',
  'HS': 'HS',
  'PP': 'PP',
  'PU': 'PU',
  'TT': 'TT',
  'TN': 'TN',
  'UM': 'UM',
  'UP': 'UP'
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season');
    const team = searchParams.get('team');
    const opponentTeam = searchParams.get('opponent_team');
    const test = searchParams.get('test');

    console.log('Frontend matches API called with params:', { season, team, opponentTeam, test });

    // Test endpoint
    if (test === 'true') {
      return NextResponse.json({
        status: 'success',
        message: 'Frontend matches API is working',
        params: { season, team, opponentTeam },
        timestamp: new Date().toISOString()
      });
    }

    // Validate required parameters
    if (!season || !team) {
      return NextResponse.json(
        { error: 'Missing required parameters: season and team are required' },
        { status: 400 }
      );
    }

    // Convert frontend team codes to database team codes
    const dbTeam = REVERSE_TEAM_MAPPING[team] || team;
    const dbOpponentTeam = opponentTeam && opponentTeam !== 'all' ? REVERSE_TEAM_MAPPING[opponentTeam] || opponentTeam : null;

    // Try to call the backend API to get real match data
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const queryParams = new URLSearchParams({
      season: season,
      team: dbTeam
    });

    if (dbOpponentTeam) {
      queryParams.append('opponent_team', dbOpponentTeam);
    }

    console.log(`Attempting to call backend: ${backendUrl}/dashboard/matches?${queryParams}`);
    console.log('Team mapping:', { team, dbTeam, opponentTeam, dbOpponentTeam });
    
    try {
      const backendResponse = await fetch(`${backendUrl}/dashboard/matches?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      console.log(`Backend response status: ${backendResponse.status}`);

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error(`Backend API error: ${backendResponse.status} ${backendResponse.statusText}`, errorText);
        throw new Error(`Backend API error: ${backendResponse.status} ${backendResponse.statusText} - ${errorText}`);
      }

      const backendData = await backendResponse.json();
      console.log('Backend data received:', backendData);
      
      // Transform backend data to frontend format - keeping uppercase team codes
      const transformedMatches = (backendData.matches || []).map((match, index) => ({
        id: match.id || index + 1,
        matchNumber: match.match_number || match.Match_Number,
        date: match.date || match.Match_Date || '2024-01-01',
        venue: match.venue || match.Venue || 'Unknown Venue',
        status: match.status || (match.Final_Team_A_Score !== null && match.Final_Team_B_Score !== null ? 'completed' : 'scheduled'),
        teamACode: match.team_a_code || match.Team_A_Code, // Keep uppercase from database
        teamBCode: match.team_b_code || match.Team_B_Code, // Keep uppercase from database
        teamAScore: match.team_a_score || match.Final_Team_A_Score,
        teamBScore: match.team_b_score || match.Final_Team_B_Score,
        attendance: match.attendance || match.Attendance,
        hasVideo: match.has_video || match.Has_Video || false,
        videoUrl: match.video_url || match.Video_URL || null
      }));

      // Filter matches based on opponent team if specified
      let filteredMatches = transformedMatches;
      if (opponentTeam && opponentTeam !== 'all') {
        filteredMatches = transformedMatches.filter(match => 
          match.teamBCode === opponentTeam
        );
      }

      return NextResponse.json({
        matches: filteredMatches,
        total: filteredMatches.length,
        season: season,
        team: team,
        opponentTeam: opponentTeam || null,
        source: 'backend'
      });

    } catch (backendError) {
      console.error('Backend call failed:', backendError.message);
      
      // Return empty matches with error message instead of throwing
      return NextResponse.json({
        matches: [],
        total: 0,
        season: season,
        team: team,
        opponentTeam: opponentTeam || null,
        source: 'error',
        error: `Backend connection failed: ${backendError.message}`,
        message: 'Please ensure the backend server is running and try again.'
      });
    }

  } catch (error) {
    console.error('Matches API error:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch matches',
        detail: error.message,
        matches: [],
        source: 'error'
      },
      { status: 500 }
    );
  }
}
