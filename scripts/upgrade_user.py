import urllib.request
import urllib.error
import urllib.parse
import json

CLERK_SECRET_KEY = "sk_test_B1v14r6z9Tru6QGlrGTeBwReHH04PKHoXmkwLjfsP0"

def get_user_by_email(email):
    # Query Clerk for user by email address
    encoded_email = urllib.parse.quote(email)
    
    # Correct endpoint for searching by email address is /users with ?email_address parameter
    url = f"https://api.clerk.com/v1/users?email_address={encoded_email}"
    
    req = urllib.request.Request(url)
    req.add_header('Authorization', f'Bearer {CLERK_SECRET_KEY}')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req) as response:
            users = json.loads(response.read().decode())
            if users:
                return users[0] # Return first match
            return None
    except urllib.error.HTTPError as e:
        print(f"Error fetching user: {e.code} {e.reason}")
        print(e.read().decode())
        return None

def update_user_metadata(user_id, metadata):
    url = f"https://api.clerk.com/v1/users/{user_id}/metadata"
    data = json.dumps({
        "public_metadata": metadata
    }).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, method='PATCH')
    req.add_header('Authorization', f'Bearer {CLERK_SECRET_KEY}')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Error updating user: {e.code} {e.reason}")
        print(e.read().decode())
        return None

target_email = "lgh425@gmail.com"
print(f"Searching for user: {target_email}...")
user = get_user_by_email(target_email)

if user:
    print(f"Found user: {user['id']}")
    print(f"Current Metadata: {user.get('public_metadata', {})}")
    
    new_metadata = {
        "tier": "PRO", 
        "role": "USER",
        "rank": "GENERAL" # 간부 회원 (Executive)
    }
    
    print(f"Upgrading user to PRO/ADMIN...")
    updated_user = update_user_metadata(user['id'], new_metadata)
    
    if updated_user:
        print("Upgrade Successful!")
        print(f"New Metadata: {updated_user.get('public_metadata', {})}")
    else:
        print("Upgrade Failed.")
else:
    print(f"User with email '{target_email}' not found in Clerk.")
    print("User needs to sign up first!")
