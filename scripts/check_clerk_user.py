import urllib.request
import urllib.error
import json
import os

# Clerk Secret Key from the file we just verified
CLERK_SECRET_KEY = "sk_test_B1v14r6z9Tru6QGlrGTeBwReHH04PKHoXmkwLjfsP0"

def check_user(query):
    # Try fetching a list of users to see if auth works at all
    url = "https://api.clerk.com/v1/users?limit=10"
    if query:
        url += f"&query={query}"
        
    req = urllib.request.Request(url)
    req.add_header('Authorization', f'Bearer {CLERK_SECRET_KEY}')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} {e.reason}")
        error_body = e.read().decode()
        print(f"Error Body: {error_body}")
        return []
    except Exception as e:
        print(f"General Error: {e}")
        return []

query = "gh386"
print(f"Checking for user: {query}...")
users = check_user(query)

if users:
    print(f"Found {len(users)} user(s) matching '{query}':")
    for u in users:
        print(f"- ID: {u['id']}")
        # Defensive check for email addresses list
        emails = u.get('email_addresses', [])
        primary_email_id = u.get('primary_email_address_id')
        primary_email = "No Email"
        
        if emails:
            # Try to match primary email
            for email_obj in emails:
                if email_obj['id'] == primary_email_id:
                    primary_email = email_obj['email_address']
                    break
            # Fallback to first email if primary not found/linked
            if primary_email == "No Email":
                primary_email = emails[0]['email_address']
                
        print(f"- Email: {primary_email}")
        print(f"- Name: {u.get('first_name', '')} {u.get('last_name', '')}")
else:
    print(f"No user found matching '{query}'.")
