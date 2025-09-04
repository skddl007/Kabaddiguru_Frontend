# Dashboard Filter System

## Overview
The dashboard now includes a comprehensive filter system that allows users to select tournament, season, team, and opponent team to view specific matches.

## Features

### 1. Filter Interface
- **Tournament Selection**: Choose from Pro Kabaddi League, National Championships, or International Events
- **Season Selection**: Select from available seasons (8, 9, 10, 11)
- **Team Selection**: Choose your primary team from all available teams
- **Opponent Team**: Optionally select a specific opponent team

### 2. Components

#### DashboardFilters.jsx
- Main filter interface component
- Beautiful UI with gradient backgrounds and smooth animations
- Filter validation and error handling
- Filter history tracking
- Responsive design for mobile and desktop

#### MatchDetails.jsx
- Displays filtered matches in a grid layout
- Match cards with team logos, scores, and status
- Search and sort functionality
- Video player integration
- Responsive design

#### API Endpoint
- `/api/dashboard/matches` - Returns match data based on filters
- Currently uses mock data (ready for backend integration)
- Supports season, team, and opponent team filtering

### 3. User Experience

#### Filter Flow
1. User selects tournament, season, and team (required)
2. Optionally selects opponent team
3. Clicks "View Matches" button
4. Dashboard switches to match details view
5. User can search, sort, and interact with matches
6. Back button returns to overview with filters

#### Visual Features
- Gradient backgrounds and hover effects
- Team logos and badges
- Status indicators (Completed, Live, Scheduled)
- Winner highlighting
- Responsive grid layout

### 4. Technical Implementation

#### State Management
- `filterView`: Controls whether to show overview or matches
- `currentFilters`: Stores active filter selections
- `showMatchDetails`: Controls match details visibility

#### Integration Points
- Integrates with existing dashboard structure
- Uses existing UI components (Button, Card, Select, etc.)
- Follows existing design patterns and color schemes

### 5. Backend Integration

#### Current Status
- Uses mock data for demonstration
- API structure ready for backend integration
- Filter parameters properly formatted

#### Backend Requirements
- Endpoint: `/dashboard/matches`
- Parameters: season, team, opponent_team (optional)
- Response: matches array with match details

#### Match Data Structure
```json
{
  "id": 1,
  "matchNumber": 1,
  "date": "2024-01-15",
  "venue": "DY Patil Stadium, Mumbai",
  "status": "completed",
  "teamACode": "TT",
  "teamBCode": "BB",
  "teamAScore": 35,
  "teamBScore": 28,
  "attendance": 15000,
  "hasVideo": true
}
```

### 6. Future Enhancements

#### Planned Features
- Advanced filtering (date ranges, venues, etc.)
- Match statistics and analytics
- Player performance data
- Export functionality
- Real-time updates

#### Backend Integration
- Replace mock data with real API calls
- Add caching for better performance
- Implement pagination for large datasets
- Add real-time match updates

## Usage

### For Users
1. Navigate to the Dashboard page
2. Use the filter interface below the header
3. Select required fields (Tournament, Season, Team)
4. Optionally select opponent team
5. Click "View Matches" to see filtered results
6. Use search and sort to find specific matches
7. Click "Back" to return to overview

### For Developers
1. Components are in `/components/` directory
2. API endpoint in `/app/api/dashboard/matches/`
3. Main integration in `/app/dashboard/page.jsx`
4. Follow existing component patterns
5. Use existing UI components and styling

## Styling

### Design System
- Uses existing Tailwind CSS classes
- Follows established color schemes
- Responsive breakpoints: sm, md, lg, xl
- Consistent spacing and typography

### Color Palette
- Primary: Blue gradients (blue-500 to indigo-600)
- Secondary: Purple gradients (purple-500 to pink-600)
- Success: Green (green-500 to emerald-600)
- Warning: Orange (orange-500 to red-600)
- Neutral: Gray scales for backgrounds and text

## Testing

### Manual Testing
1. Test filter selection and validation
2. Test match display and interaction
3. Test responsive design on different screen sizes
4. Test error handling and edge cases

### Component Testing
- Test filter state changes
- Test API integration
- Test user interactions
- Test accessibility features

## Dependencies

### Required Components
- `@/components/ui/button`
- `@/components/ui/card`
- `@/components/ui/select`
- `@/components/ui/badge`
- `@/components/ui/input`
- `@/hooks/use-toast`
- `lucide-react` icons

### External Dependencies
- React hooks (useState, useEffect)
- Next.js routing and API
- Tailwind CSS for styling

## Troubleshooting

### Common Issues
1. **Filters not working**: Check component props and state
2. **API errors**: Verify endpoint configuration
3. **Styling issues**: Check Tailwind CSS classes
4. **Performance**: Optimize re-renders and API calls

### Debug Steps
1. Check browser console for errors
2. Verify component props and state
3. Test API endpoint directly
4. Check network requests and responses

## Contributing

### Code Style
- Follow existing component patterns
- Use consistent naming conventions
- Add proper TypeScript types
- Include error handling
- Add loading states

### Testing
- Test all filter combinations
- Verify responsive behavior
- Check accessibility features
- Test error scenarios
