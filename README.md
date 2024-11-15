# PlayByMood

[PlayByMood](https://playbymood.com/) is a game recommendation website designed to match users with games that align their current mood. Users can select a mood, and PlayByMood will suggest a top-rated game that suit their feelings.

The available moods are:

- Excited
- Relaxed
- Focused
- Adventurous
- Competitive
- Curious
- Nostalgic
- Social
- Angry
- Strategic
- Playful

Every month, PlayByMood automatically updates its game suggestions through an integration with the [rawg.io](https://rawg.io/) database. Games are selected based on ratings, tags, and genres that best fit each mood. For example, when finding games suggestions for the "Strategic" mood, PlayByMood searches [rawg.io](https://rawg.io/) for highly rated games with tags like "economy," "city-builder," "management," "tactical," and more, or those in the "strategy" genre. You can view the specific search parameters for each mood in the `QUERIES_BY_MOOD` object.

## Build with

- NextJs
- Tailwind
- shadcn/ui
- MongoDB
- Inngest
- Vercel Cron Jobs

## How to Run the Project

### Environment Variables

Create a `.env` file in the root directory and add the following variables:  
```env
MONGODB_URI="<your-mongodb-uri>"
RAWG_API_KEY="<your-rawg-api-key>"
CRON_SECRET="<define-a-secret>"
```

### Run the Project

To start the application, use Docker Compose:  
```bash
docker compose up
```
After this, the project will be available at http://localhost:3000.

### Run the Inngest Dev Server

1. Access the Docker terminal:  
   ```bash
   yarn sh
   ```
2. Start the Inngest Dev Server:  
   ```bash
   yarn inngest
   ```

### Trigger the Games Import Flow

To manually trigger the games import process, use the following cURL command:  
```bash
curl --request GET \
  --url http://localhost:3000/api/cron/games-importer \
  --header 'Authorization: Bearer <CRON_SECRET>'
``` 
