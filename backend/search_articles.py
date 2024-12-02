import requests
from bs4 import BeautifulSoup
import time

# Function to perform a Google search
def search_google(topic, subject_name, num_results=1):
    query = f"{topic} in {subject_name}"
    search_url = f"https://www.google.com/search?q={query}&num={num_results}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        links = []
        for item in soup.select('div.tF2Cxc a'):  # Selector for links
            link = item.get('href')
            if link.startswith("http"):
                links.append(link)
        time.sleep(1)  # Delay to avoid being blocked
        return links[:num_results]
    except requests.exceptions.RequestException as e:
        print(f"Error during Google search: {e}")
        return []

# Function to perform a fallback search
def fallback_search(topic, subject_name):
    context_keywords = ["overview", "tutorial", "lecture notes"]
    fallback_links = []

    for keyword in context_keywords:
        refined_query = f"{topic} {keyword} in {subject_name}"
        refined_links = search_google(refined_query, subject_name, num_results=2)
        if refined_links:
            fallback_links.extend(refined_links)
            break

    site_searches = ["geeksforgeeks.org", "javatpoint.com", "medium.com"]
    for site in site_searches:
        site_query = f"{topic} site:{site}"
        site_links = search_google(site_query, subject_name, num_results=2)
        if site_links:
            fallback_links.extend(site_links)
            break

    return fallback_links[:3] if fallback_links else ["No results found"]

# Function to find article links
def find_article_links(syllabus_content, subject_name):
    article_links = {}
    for module, topics in syllabus_content.items():
        module_links = {}
        for topic in topics:
            links = search_google(topic, subject_name)
            if not links:
                links = fallback_search(topic, subject_name)
            module_links[topic] = links[0] if links else "No results found"
        article_links[module] = module_links
    return {"Syllabus_content": article_links}

# Main function exposed as a module API
def map_syllabus_to_articles(syllabus_json):
    """
    Maps syllabus content to article links.

    Args:
        syllabus_json (dict): JSON object containing the syllabus.

    Returns:
        dict: Processed JSON object with article links.
    """
    if not isinstance(syllabus_json, dict):
        raise ValueError("Input must be a JSON object (dictionary).")

    # Dynamically fetch the first top-level key (subject name)
    subject_name = list(syllabus_json.keys())[0]
    syllabus_content = syllabus_json[subject_name].get("Syllabus_content")

    if not syllabus_content:
        raise ValueError(f"No syllabus content found for '{subject_name}'.")

    # Clean subject name (handle cases with "and", "&", or other separators)
    subject = subject_name.split('and')[0].strip() if 'and' in subject_name else subject_name
    subject = subject.split('&')[0].strip() if '&' in subject else subject

    # Find article links and return the result
    article_links = find_article_links(syllabus_content, subject)
    return {subject_name: article_links}
