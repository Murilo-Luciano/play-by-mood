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
