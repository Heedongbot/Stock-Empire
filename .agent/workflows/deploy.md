---
description: How to deploy the Stock Empire application to Vercel and automate crawlers
---

# Stock Empire Deployment Workflow

Follow these steps to take your application live.

## 1. Prepare GitHub Repository
- Create a new repository on GitHub.
- Push your local `stock-empire` folder to this repository.

## 2. Deploy Frontend to Vercel
// turbo
1. Open [Vercel](https://vercel.com).
2. Click **"Add New"** > **"Project"**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `web` if it's not automatically detected.
5. Click **Deploy**.

## 3. Setup Automated AI Scrapers
Create a file at `.github/workflows/update_data.yml` with the following content:

```yaml
name: Update Market Data
on:
  schedule:
    - cron: '*/30 * * * *'
  workflow_dispatch:
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - run: pip install yfinance pandas beautifulsoup4 requests lxml deep-translator
      - run: |
          python crawler/us_news_crawler.py
          python crawler/alpha_analyzer.py
      - run: |
          git config --global user.name "Bot"
          git config --global user.email "bot@empire.ai"
          git add web/public/*.json
          git commit -m "update data [skip ci]" || exit 0
          git push
```

## 4. Verify Live Site
- Access your Vercel URL.
- Check the **Analysis** page to see if real-world data is appearing.
- Upgrade a user to **VVIP** via the pricing section to unlock all features!
