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

When a mood is selected, PlayByMood queries the [rawg.io](https://rawg.io/) database for a matching game (responses are cached for a day). Games are selected based on ratings, tags, and genres that best fit each mood. For example, when finding games suggestions for the "Strategic" mood, PlayByMood searches [rawg.io](https://rawg.io/) for highly rated games with tags like "economy," "city-builder," "management," "tactical," and more, or those in the "strategy" genre. You can view the specific search parameters for each mood in the `QUERIES_BY_MOOD` object.

## Build with

- NextJs
- Tailwind
- shadcn/ui

## How to Run the Project

### Environment Variables

Create a `.env` file in the root directory and add the following variable:  
```env
RAWG_API_KEY="<your-rawg-api-key>"
```

### Run the Project

To start the application, use Docker Compose:  
```bash
docker compose up
```
After this, the project will be available at http://localhost:3000.

## Contributing

Contributions to `PlayByMood` are always welcome! If you find a bug or have a feature request, please create an [issue](https://github.com/Murilo-Luciano/play-by-mood/issues/new) on GitHub. If you'd like to contribute code, please [fork](https://github.com/Murilo-Luciano/play-by-mood/fork) the repository and submit a pull request.
