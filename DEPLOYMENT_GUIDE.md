# Stock Empire Deployment & Automation Guide

This guide explains how to deploy the **Stock Empire** application and automate the AI news/alpha analyzers using GitHub Actions.

## 1. Frontend Deployment (Vercel)

The fastest and most reliable way to deploy the Next.js frontend.

1.  **Push to GitHub**: Upload your `stock-empire` project to a new private or public GitHub repository.
2.  **Connect to Vercel**:
    -   Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
    -   Import your GitHub repository.
    -   Leave the default settings (Next.js preset).
    -   Click **Deploy**.
3.  **Result**: Your site is now live at `your-project.vercel.app`.

---

## 2. Automation Deployment (GitHub Actions)

Since Vercel is serverless, we need a separate place to run our Python scrapers every 30-60 minutes. We'll use GitHub Actions to run the scripts and "push" the updated JSON data back to the repo, which causes Vercel to redeploy with fresh data.

### Step 1: Create the workflow file
Create a file at `.github/workflows/update_data.yml` in your repository.

```yaml
name: Update Market Data

on:
  schedule:
    - cron: '*/30 * * * *' # Every 30 minutes
  workflow_dispatch: # Allows manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install Dependencies
        run: |
          pip install yfinance pandas beautifulsoup4 requests lxml deep-translator gTTS moviepy==1.0.3

      - name: Run Crawler & Analyzer
        run: |
          python crawler/us_news_crawler.py
          python crawler/alpha_analyzer.py

      - name: Commit and Push Changes
        run: |
          git config --global user.name "Empire-Bot"
          git config --global user.email "bot@stockempire.ai"
          git add web/public/us-news-tiered.json web/public/alpha-signals.json
          git commit -m "chore: auto-update market data [skip ci]" || echo "No changes to commit"
          git push
```

---

## 3. Environment Variables (Optional)

If you later add API keys (like OpenAI or NewsAPI):
1.  Go to Vercel Project Settings > **Environment Variables**.
2.  Add your keys (e.g., `OPENAI_API_KEY`).
3.  In GitHub Actions, go to Settings > Secrets > **Actions** and add the same keys.

---

## 4. Local Persistence

If you prefer to keep running it locally for now:
1.  Keep the `python crawler/us_news_crawler.py` and `python crawler/alpha_analyzer.py` terminals open.
2.  They will continue to update the `web/public` folder every 30 minutes.
3.  Your local Next.js (`npm run dev`) will pick up the changes automatically.

**Congratulations! Your AI-driven Stock Empire is ready for the world!** 🚀💰
