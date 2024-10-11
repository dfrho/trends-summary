# Search by State Trends

## Overview

Search by State Trends is a hobby project that allows users to explore real-time Google search trends for different states in the United States. This interactive web application provides a unique way to understand what's currently capturing people's attention across various regions of the country.

## Features

- Interactive US map for easy state selection
- Real-time Google Trends data for each state
- AI-generated summaries of trending topics
- Responsive design for desktop and mobile use

## Use Cases

1. **Remote Team Collaboration**: During virtual meetings, quickly look up what's trending in your colleagues' locations to spark conversation or understand local contexts.

2. **Empathy Check**: Stay informed about potential local issues, bad news, or severe weather events affecting your contacts or clients in different states.

3. **Content Creation**: Gain insights into region-specific interests for targeted content creation or marketing strategies.

4. **Cultural Awareness**: Explore trending topics across different states to better understand diverse perspectives and current events across the country.

5. **Ice Breaker**: Use as an interesting conversation starter in meetings or social gatherings.

## Technology Stack

- Frontend: React with Next.js
- Backend: Next.js API routes
- Map Visualization: react-simple-maps
- Trend Data: Google Trends RSS feed
- AI Summary: OpenAI GPT-3.5

## Current Architecture

The current architecture of Search by State Trends is designed for simplicity and real-time data processing:

1. **Data Fetching**: The application fetches real-time data from the Google Trends RSS feed for each selected state.

2. **State Selection**: Users interact with an interactive US map to select a state of interest.

3. **Trend Processing**: When a state is selected, the backend processes the RSS feed data to extract relevant trend information.

4. **AI Summary Generation**: The extracted trend data is sent to OpenAI's GPT-3.5 model, which generates a concise summary of the trending topics.

5. **Display**: The frontend displays both the raw trend data and the AI-generated summary to the user.

This architecture allows for quick, on-demand access to current trend data without the need for a persistent database or complex data storage solutions.

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/search-by-state-trends.git
   ```

2. Install dependencies:
   ```
   cd search-by-state-trends
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env.local`:
     ```
     cp .env.example .env.local
     ```
   - Open `.env.local` and replace `your_openai_api_key_here` with your actual OpenAI API key:
     ```
     OPENAI_API_KEY=sk-your-actual-api-key
     ```
   
   Note: Make sure to keep your API key confidential and never commit it to version control.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Google Trends for providing the trending data
- OpenAI for the GPT-3.5 model used in generating summaries
- React Simple Maps for the interactive US map visualization

## Disclaimer

This project is not affiliated with, endorsed, or sponsored by Google. It uses publicly available data from Google Trends.