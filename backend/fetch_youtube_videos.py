# fetch_youtube_videos.py
import re
import json
from googleapiclient.discovery import build


# Function to convert ISO 8601 duration to HH:MM:SS format
def iso_to_hms(duration):
    # Regex pattern to extract hours, minutes, and seconds
    pattern = r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?"
    match = re.match(pattern, duration)

    if match:
        # Extract hours, minutes, and seconds or set to 0 if not present
        hours = int(match.group(1)) if match.group(1) else 0
        minutes = int(match.group(2)) if match.group(2) else 0
        seconds = int(match.group(3)) if match.group(3) else 0

        # Format and return as HH:MM:SS
        return f"{hours}:{minutes:02}:{seconds:02}"
    else:
        return "0:00:00"


# Function to fetch YouTube videos for syllabus topics
def fetch_youtube_videos(api_key, syllabus_content, subject_name, max_results=1):
    # Build the YouTube service
    youtube = build('youtube', 'v3', developerKey=api_key)

    # Clean the subject name
    subject = ""
    if 'and' in subject_name:
        subject = subject_name.split('and')[0].strip()
    elif '&' in subject_name:
        subject = subject_name.split('&')[0].strip()

    # Dictionary to store video details
    video_results = {}

    # Loop through each module and its topics
    for module, topics in syllabus_content.items():
        video_results[module] = []  # Initialize a list for each module

        # Loop through all topics in the module (topics is a list of strings)
        for topic in topics:
            enhanced_query = f"{topic} in {subject}"  # Create enhanced search query for the topic

            # Make the search request for the enhanced query
            request = youtube.search().list(
                part="snippet",
                q=enhanced_query,  # Search query for each topic
                type="video",  # Only fetch videos
                maxResults=max_results,  # Limit the number of results to 1
                order="relevance"  # Get the most relevant results
            )

            # Execute the request and get the response
            response = request.execute()

            # Extract video details from the response
            for item in response['items']:
                if 'videoId' in item['id']:
                    video_id = item['id']['videoId']
                    # Fetch video details to get the duration
                    video_response = youtube.videos().list(
                        part="contentDetails",
                        id=video_id
                    ).execute()

                    # Extract the video duration (ISO 8601 format)
                    duration = video_response['items'][0]['contentDetails']['duration']
                    video_length = iso_to_hms(duration)
                    video_details = {
                        'topic': topic,
                        'enhanced_query': enhanced_query,
                        'title': item['snippet']['title'],
                        'url': f"https://www.youtube.com/watch?v={video_id}",
                        'description': item['snippet']['description'],
                        'duration': video_length , # Add the duration here
                        'completed' : False,
                        'favorite' : False
                    }
                    video_results[module].append(video_details)

    return {subject_name: video_results}