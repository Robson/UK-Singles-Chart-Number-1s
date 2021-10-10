"""

**********
Disclaimer
**********

This is my first proper Python script, so don't use this for learning!

*************************
What does this script do?
*************************

There are articles on Wikipedia that list the UK Singles Chart number ones per decade.
For example: https://en.wikipedia.org/wiki/List_of_UK_Singles_Chart_number_ones_of_the_2020s

This script converts the HTML of those pages into JSON, which can then be used by the page
in this GitHub repository, to visualise that data.

********
Singles?
********

"Singles" refers to songs that are released on their own, rather than part of an album.

As far as I know, we don't have a chart that ranks all the single people in the UK.

******************
How do I use this?
******************

1. On desktop (not mobile) go to
   https://en.wikipedia.org/wiki/List_of_UK_Singles_Chart_number_ones_of_the_1950s
2. View the source of the page (not the source of the article).
3. Save as 1950s.txt in the same folder as this script. Save as ANSI encoding.
4. Repeat for all the other decades.
5. Run the script.
6. You will now have a data.json file with all of that data in a usable format.

***********************************
Wait, that seems suspiciously easy?
***********************************

Some artists/songs have weird characters in their name.
You may therefore want to have a read through the data, to fix anything like that.

*************
Compatibility
*************

I run this in Python 3.7 using Spyder 3.3.3, but it probably works fine in a variety of other
versions and IDEs.

"""

import json, re

# always end in zero
DECADE_START = 1950
DECADE_END = 2020

def create_songs_metadata():
    rows = []
    for i in range(DECADE_START, DECADE_END+1, 10):
        rows.extend(get_data(i))
    rows = list(filter(is_song, rows))
    rows = list(map(clean_data, rows))
    rows = list(map(get_metadata, rows))
    rows = remove_duplicates(rows)
    rows = add_returns_metadata(rows)
    return rows

def get_data(decade):
    # make an array of all rows within the page. some will be songs and some will be unwanted stuff
    raw = ''
    with open(r'{}s.txt'.format(decade), 'r', encoding="ansi") as file_input:
        raw = file_input.read()
    raw = raw.replace('\n', '').replace('\r', '')
    return re.compile('</tr><tr[^>]*>').split(raw)

def is_song(html):
    return '<th scope="row" style="text-align:center;">' in html and \
           not 'Return of a single to number one' in html

def clean_data(html):
    # it's dirty
    html = re.sub('&#(160|32);', ' ', html)
    html = re.sub(' scope="row" style="text-align:center;"', '', html)
    html = re.sub('<td[^>]*>', '<td>', html)
    html = re.sub(' *(title|data-sort-value)="[^\"]+"', '', html)
    html = re.sub('<span *(|style="[^"]+"|class="(vcard|fn)")>', '', html)
    html = re.sub('</span>', '', html)
    html = re.sub(' *class="mw-redirect" *', '', html)
    html = re.sub('<(/?)th>', '<\\1td>', html)
    html = re.sub('</?i>', '', html)
    html = re.sub(r' *(‡|†|\^|\*) *', '', html)
    html = re.sub('<sup[^>]+><a[^>]+>[^<]+</a></sup>', '', html)
    html = re.sub(' *<img[^>]+> *', '', html)
    return html

def get_metadata(html):
    parts = html.split('</td><td>')
    parts[0] = parts[0].replace('<td>', '')
    parts[-1] = parts[-1].replace('</td>', '')
    # some decades have an extra record-company column, so let's remove that
    if len(parts) >= 4:
        if not bool(re.match(r'\A\d{1,2} [A-Z][a-z]+ \d{4}\Z', parts[3])):
            parts[3:5] = parts[4:6]
        parts[4] = parts[4].split('</tr>')[0]
    return dict(zip(['number', 'artist', 'song', 'date', 'woc'], parts))

def remove_duplicates(songs):
    # when a song goes across decades, it can be included in both decades.
    # we don't want those duplicates, so let's remove them
    for i in sorted(range(1, len(songs)), reverse=True):
        if songs[i]['date'] == songs[i-1]['date']:
            songs.pop(i)
    return songs

def add_returns_metadata(songs):
    for i, e1 in enumerate(songs):
        appearances = []
        for j, e2 in enumerate(songs):
            if songs[i]['artist'] == songs[j]['artist'] and \
               songs[i]['song'] == songs[j]['song']:
               appearances.append(j)
        songs[i]['appearances'] = appearances
    return songs

# this code helps to diagnose any issues
def show_issues(songs):
    for invalid in list(filter(lambda x: not is_valid_metadata(x), songs)):
        print(invalid)

def is_valid_metadata(line):
    return bool(re.match(r'(\d+|re)\Z', line['number'])) and \
           bool(re.match(r'<a', line['artist'])) and \
           bool(re.match(r'"?<a.*(</a>|"|\))\Z', line['song'])) and \
           bool(re.match(r'\d{1,2} [A-Z][a-z]+ \d{4}\Z', line['date'])) and \
           bool(re.match(r'[\.\dx]+\Z', line['woc']))

def save_javascript(songs):
    with open('data.json', 'w') as file_output:
        file_output.write('var data = ' + json.dumps(songs, indent=4))

metadata = create_songs_metadata()
show_issues(metadata)
save_javascript(metadata)