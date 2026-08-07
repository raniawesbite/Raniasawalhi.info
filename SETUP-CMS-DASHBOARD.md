# Setting up your editing dashboard

This is a one-time setup (about 15–20 minutes). After this, editing your site looks like: go to a web page, log in, click a field, type, click save. No files, no code.

## What you're setting up

Your site currently lives on Netlify because you dragged a file onto it. To get a real dashboard, Netlify needs to get your files from **GitHub** instead (a free place to store code), because the dashboard tool (called Decap CMS) saves your edits by updating the file on GitHub, and Netlify automatically republishes whenever that happens.

## Step 1 — Create a GitHub account (skip if you have one)

1. Go to [github.com](https://github.com) → **Sign up** → follow the prompts (free)

## Step 2 — Create a new repository

1. Click the **+** icon (top right) → **New repository**
2. Name it something like `rania-sawalhi-website`
3. Set it to **Public** (required for the free tier to work smoothly)
4. Click **Create repository**

## Step 3 — Upload your site files

1. On the new repo's page, click **"uploading an existing file"** (or **Add file → Upload files**)
2. Drag in your **entire project folder's contents**, keeping the folder structure:
   - `index.html`
   - the `content` folder (with `site.json` inside)
   - the `admin` folder (with `index.html` and `config.yml` inside)
   - the `images` folder
3. Scroll down, click **Commit changes**

## Step 4 — Connect this GitHub repo to Netlify

1. Go to your Netlify dashboard → your project (`dynamic-pony-1ff204`)
2. Go to **Project configuration → Build & deploy** (or **"Link repository"** if offered on the overview page)
3. Choose **GitHub**, authorize Netlify to access your account, and select the repo you just created
4. Leave build settings empty/default (this is a plain HTML site, nothing to "build") — just confirm the publish directory is the root (`/`)
5. Save — Netlify will redeploy from GitHub automatically from now on. Your domain settings stay exactly as they are; nothing about the DNS work changes.

## Step 5 — Turn on Netlify Identity

1. In your Netlify project, go to **Project configuration → Identity**
2. Click **Enable Identity**
3. Under **Registration**, set it to **Invite only** (so random people can't sign up to edit your site)

## Step 6 — Turn on Git Gateway

1. Still under Identity settings, scroll to **Services → Git Gateway**
2. Click **Enable Git Gateway**
(This is what lets the dashboard save changes back to GitHub on your behalf.)

## Step 7 — Invite yourself as a user

1. In Identity, click **Invite users**
2. Enter your own email
3. Check your inbox for an invite email from Netlify, click the link, set a password

## Step 8 — Open your dashboard

Go to:
```
https://raniasawalhi.info/admin/
```
(or your `.netlify.app` address + `/admin/` if the domain isn't finished connecting yet)

Log in with the email/password from Step 7. You'll see a form-based editor for every section of your site — text fields, an image upload button for photos, and "Add" buttons for lists like awards or publications.

## Editing from now on

1. Go to `/admin/`, log in
2. Click into any section (Hero, About, Awards, Publications, etc.)
3. Edit the fields — for photos, click the image field and upload directly, no file management needed
4. Click **Publish** (top right)
5. Netlify rebuilds automatically — changes are live within a minute or two

That's it — no more opening HTML files, no more dragging files onto Netlify by hand.
