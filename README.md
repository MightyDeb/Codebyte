# Codebyte
Codebyte is a competitive programming arena where users can engage and participate in custom contests, track performance and engage in problem solving with Codeforces integration. It is a cutting-edge competitive programming platform designed to challenge, engage, and elevate coders of all skill levels. It is built on seamless UI/UX and responsive design for smooth user experience. Whether you're a beginner looking to learn or an expert aiming to climb the leaderboard, Codebyte is your go-to platform for coding excellence.

## Features Implemented
- **User Authentication and Login** : Secure login using cookies and web tokens, user profiles displaying contest history, rankings and performance analytics and displaying the rating curve along with comparison bar among friends.
- **Contest Creation and Management** : Users can create private contests, set durations, and select problems which are redirected to Codeforces for submission and evaluation and then display the result and leaderboard of the contest. 
- **Automated Scoring and Leaderboard**: Real-time leaderboard with an ICPC style penalty system based on Codeforces verdicts.
- **Problem Discovery and Customization**: Browse problems by difficulty, tags, and personal performance history.
- **Notifications and reminders**: Alerts for upcoming contests, invitations and leaderboard updates.
- **Analytics Dashboard**: Insights on performance trends, weak topics, and progress tracking.
- **Comparison with friends**: Head-to-head performance comparison in past contests and leaderboard for each contest.
- **Smart problem recommendations**: Suggestions based on weak topics.

## Hosted Links:
[Frontend](https://codebyte-seven.vercel.app/) (hosted on Vercel)

[Backend](https://codebyte-if2s.onrender.com) (hosted on Render)

## Screenshots:
Click [here](assets)

## Technologies Used:
### Front-end:
1. HTML
2. CSS, Tailwind
3. MaterialUI
4. JavaScript
5. React
6. React HotToast
7. Recharts, LucidReact

### Back-end:
1. Node.js
2. Express.js
3. MongoDB
4. JSON Web Token, BCrypt, Cookie Parser
5. Socket.io
6. Axios, Cors

## API Endpoints:
### Codeforces Public API:
- To get the recent submission results.
- To get list of problems
- To get user info from user's handle
- To get list of contests taken part in

### Gemini 1.5 Flash
- Smart problem recommendations according to rank and performance
- SWOT analysis according to contest performance, rank and continuity
   
