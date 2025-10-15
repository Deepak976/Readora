#!/usr/bin/env python3
"""
Update Book Descriptions - Remove Gutenberg Branding
====================================================
Updates existing books in database with clean descriptions
Only describes the book content, no platform mentions

Usage:
    python update_book_descriptions.py
"""

import psycopg2
from typing import Dict, List

# ============================================================================
# DATABASE CONNECTION
# ============================================================================
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'postgres',  # From docker-compose
    'user': 'postgres',      # From docker-compose
    'password': 'postgres'   # From docker-compose
}

# ============================================================================
# BOOK DESCRIPTIONS - CLEAN, ONLY ABOUT THE BOOKS
# ============================================================================
BOOK_DESCRIPTIONS = {
    # Classic Literature
    "Pride and Prejudice": "A witty romantic novel exploring themes of love, reputation, and class in Georgian England. Elizabeth Bennet navigates society's expectations while staying true to herself.",
    
    "Moby Dick": "An epic tale of obsession and revenge. Captain Ahab's relentless pursuit of the white whale explores humanity's struggle against nature and fate.",
    
    "The Great Gatsby": "A portrait of the Jazz Age excess and tragedy. The mysterious millionaire Jay Gatsby's quest for lost love reveals the hollow core of the American Dream.",
    
    "Jane Eyre": "A powerful story of a young woman's journey from orphaned hardship to independence and love, challenging Victorian social norms.",
    
    "Wuthering Heights": "A dark tale of passionate, destructive love on the Yorkshire moors. Heathcliff and Catherine's intense relationship spans generations.",
    
    "Frankenstein": "A gothic masterpiece exploring the consequences of unchecked ambition. A scientist creates life, only to be haunted by his creation.",
    
    "Dracula": "The definitive vampire novel. Count Dracula's arrival in England unleashes supernatural terror, told through letters and diary entries.",
    
    "Alice's Adventures in Wonderland": "A whimsical journey down the rabbit hole into a nonsensical world of peculiar creatures and impossible logic.",
    
    "The Adventures of Sherlock Holmes": "Brilliant deductive mysteries featuring literature's most famous detective and his loyal companion Dr. Watson.",
    
    "A Tale of Two Cities": "Set during the French Revolution, this story of sacrifice and redemption spans London and Paris during turbulent times.",
    
    "Great Expectations": "A young orphan's journey from poverty to gentleman, exploring themes of ambition, social class, and moral growth.",
    
    "Oliver Twist": "A orphan boy's escape from the workhouse leads him into London's criminal underworld, exposing social injustice.",
    
    "The Picture of Dorian Gray": "A handsome young man sells his soul to remain forever youthful while his portrait ages, revealing his moral decay.",
    
    "Treasure Island": "A thrilling adventure of pirates, buried treasure, and mutiny on the high seas, seen through a young boy's eyes.",
    
    "The Strange Case of Dr. Jekyll and Mr. Hyde": "A chilling exploration of human duality. A respected doctor's experiments unleash his dark alter ego.",
    
    "The Time Machine": "A scientist travels to the distant future, discovering humanity's disturbing evolution in this pioneering science fiction tale.",
    
    "The War of the Worlds": "Martians invade Victorian England with devastating technology, challenging humanity's place in the universe.",
    
    "Heart of Darkness": "A journey up the Congo River becomes a descent into the darkness of colonialism and the human soul.",
    
    "The Count of Monte Cristo": "An epic tale of betrayal, imprisonment, and elaborate revenge. Edmond Dantès escapes and reinvents himself to punish his enemies.",
    
    "Les Misérables": "A sweeping saga of redemption in 19th century France. Jean Valjean's transformation from convict to saint amid revolution.",
    
    "The Three Musketeers": "Swashbuckling adventure in 17th century France. D'Artagnan joins three legendary musketeers in intrigue and heroism.",
    
    "Anna Karenina": "A tragic love affair in Imperial Russia explores marriage, fidelity, family, and the consequences of passion.",
    
    "Crime and Punishment": "A psychological thriller examining guilt and redemption. A poor student commits murder and descends into paranoia.",
    
    "The Brothers Karamazov": "A philosophical novel exploring faith, doubt, and morality through the lives of three brothers and their father's murder.",
    
    "War and Peace": "An epic portrayal of Russian society during the Napoleonic era, interweaving historical events with intimate family dramas.",
    
    "Don Quixote": "A delusional knight-errant and his practical squire embark on adventures, blurring the line between reality and fantasy.",
    
    "The Odyssey": "Homer's epic poem of Odysseus's ten-year journey home after the Trojan War, facing monsters, gods, and temptations.",
    
    "The Iliad": "The climactic events of the Trojan War, focusing on Achilles' rage and the heroic code of ancient Greek warriors.",
    
    "Metamorphoses": "Ovid's masterwork chronicling mythological transformations from creation to Julius Caesar, blending Roman and Greek legends.",
    
    "The Divine Comedy": "Dante's visionary journey through Hell, Purgatory, and Paradise, guided by Virgil and Beatrice in this medieval masterpiece.",
    
    "Paradise Lost": "Milton's epic poem retelling the Biblical fall of man, Satan's rebellion, and humanity's loss of Eden.",
    
    "Candide": "A satirical adventure mocking philosophical optimism as the naive Candide encounters disaster after disaster worldwide.",
    
    "Gulliver's Travels": "A ship's surgeon visits fantastical lands—tiny Lilliputians, giant Brobdingnagians—in this savage satire of human nature.",
    
    "Robinson Crusoe": "A shipwrecked sailor survives alone on a tropical island for 28 years, mastering nature and confronting solitude.",
    
    "The Scarlet Letter": "In Puritan New England, Hester Prynne bears shame and resilience after being branded with an adulteress's mark.",
    
    "Moby-Dick": "Captain Ahab's monomaniacal hunt for a white whale becomes an exploration of obsession, fate, and humanity's place in nature.",
    
    "The Adventures of Tom Sawyer": "A mischievous boy's adventures in a Mississippi River town, from whitewashing fences to witnessing murder.",
    
    "Adventures of Huckleberry Finn": "Huck and escaped slave Jim raft down the Mississippi, encountering moral dilemmas and American society.",
    
    "Little Women": "Four sisters navigate adolescence, family bonds, and personal dreams during and after the American Civil War.",
    
    "The Call of the Wild": "A domesticated dog is stolen and thrust into the brutal Yukon wilderness, awakening his primal instincts.",
    
    "White Fang": "A wolf-dog's journey from wilderness to civilization, exploring the boundaries between savage nature and domestic life.",
    
    "The Jungle Book": "Stories of Mowgli, a boy raised by wolves in the Indian jungle, learning the law of the wild.",
    
    "The Secret Garden": "An orphaned girl discovers a hidden, neglected garden and helps heal herself and others through its restoration.",
    
    "Anne of Green Gables": "An imaginative, talkative orphan transforms the lives of her adoptive family in rural Prince Edward Island.",
    
    "Peter Pan": "The boy who never grows up whisks children to Neverland, a world of pirates, fairies, and eternal youth.",
    
    "The Wonderful Wizard of Oz": "Dorothy's Kansas farmhouse lands in a magical land, beginning her quest to return home via the Yellow Brick Road.",
    
    # Philosophy & Psychology
    "Meditations": "Personal reflections of Roman Emperor Marcus Aurelius on Stoic philosophy, duty, and living virtuously.",
    
    "Beyond Good and Evil": "Nietzsche challenges traditional morality, proposing a philosophy beyond conventional notions of good and evil.",
    
    "Thus Spoke Zarathustra": "Nietzsche's philosophical novel introducing concepts like the Übermensch and eternal recurrence through prophetic prose.",
    
    "The Republic": "Plato's Socratic dialogue exploring justice, the ideal state, and the nature of reality through the allegory of the cave.",
    
    "Discourse on Method": "Descartes establishes his philosophical method and the famous conclusion 'I think, therefore I am.'",
    
    "Critique of Pure Reason": "Kant's groundbreaking work examining the limits of human knowledge and the nature of metaphysics.",
    
    "The Crowd": "A pioneering study of collective psychology, exploring how individuals behave differently in crowds.",
    
    "The Art of Controversy": "Schopenhauer's guide to winning arguments through rhetorical strategies and logical techniques.",
    
    "The Interpretation of Dreams": "Freud's revolutionary theory that dreams are the unconscious mind's wish fulfillment, introducing psychoanalysis.",
    
    # Business & Strategy
    "The Art of War": "Ancient Chinese military strategy emphasizing flexibility, deception, and understanding both enemy and self.",
    
    "The Prince": "Machiavelli's pragmatic guide to political power, advocating cunning and strategic ruthlessness when necessary.",
    
    "The Wealth of Nations": "Adam Smith's foundational economics text introducing the 'invisible hand' and principles of free markets.",
    
    "Self-Reliance": "Emerson's essay championing individualism, nonconformity, and trusting one's own intuition and judgment.",
    
    # Science
    "On the Origin of Species": "Darwin's groundbreaking theory of evolution by natural selection, revolutionizing biology and our understanding of life.",
    
    "Relativity": "Einstein explains his special and general theories of relativity, reshaping our understanding of space, time, and gravity.",
    
    "The Voyage of the Beagle": "Darwin's journal from his five-year voyage, containing observations that led to his theory of evolution.",
    
    "The Problems of Philosophy": "Bertrand Russell's accessible introduction to fundamental philosophical questions and methods of reasoning.",
    
    # Biography
    "The Autobiography of Benjamin Franklin": "America's founding father recounts his rise from poverty to statesman, sharing wisdom and wit.",
    
    "Narrative of the Life of Frederick Douglass": "A powerful slave narrative detailing Douglass's journey from bondage to freedom and literacy.",
    
    "Life on the Mississippi": "Mark Twain's memoir of his years as a steamboat pilot on the great American river.",
    
    # Political Philosophy
    "Leviathan": "Hobbes argues for a social contract and strong central authority to prevent humanity's natural state of war.",
    
    "The Social Contract": "Rousseau's influential theory that legitimate political authority comes from a social contract among free people.",
    
    "Democracy in America": "Tocqueville's prescient analysis of American democracy, equality, and individualism in the young nation.",
    
    # Poetry
    "Sonnets from the Portuguese": "Elizabeth Barrett Browning's passionate love sonnets, including the famous 'How do I love thee?'",
    
    "The Raven": "Edgar Allan Poe's haunting narrative poem of a man tormented by loss and a mysterious raven's refrain: 'Nevermore.'",
    
    "Leaves of Grass": "Walt Whitman's free verse celebration of democracy, nature, love, and the human experience in America.",
}

# ============================================================================
# UPDATE FUNCTIONS
# ============================================================================

def connect_to_db():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return None

def get_all_books(conn):
    """Get all books from database"""
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, description FROM books WHERE is_public = true")
    books = cursor.fetchall()
    cursor.close()
    return books

def update_book_description(conn, book_id: int, new_description: str):
    """Update a single book's description"""
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE books SET description = %s WHERE id = %s",
        (new_description, book_id)
    )
    conn.commit()
    cursor.close()

def update_all_descriptions(conn):
    """Update all book descriptions"""
    books = get_all_books(conn)
    
    updated = 0
    not_found = 0
    skipped = 0
    
    print(f"\n📚 Found {len(books)} public books in database")
    print("\n" + "="*70)
    print("UPDATING DESCRIPTIONS")
    print("="*70 + "\n")
    
    for book_id, title, current_desc in books:
        # Check if description needs updating
        if current_desc and ('Gutenberg' in current_desc or 'Project' in current_desc or 'Readora' in current_desc):
            needs_update = True
        elif not current_desc:
            needs_update = True
        else:
            needs_update = False
        
        if not needs_update:
            print(f"⏭️  SKIP: {title} (description already clean)")
            skipped += 1
            continue
        
        # Find matching description
        new_description = BOOK_DESCRIPTIONS.get(title)
        
        if new_description:
            print(f"✅ UPDATE: {title}")
            print(f"   OLD: {current_desc[:60] if current_desc else 'None'}...")
            print(f"   NEW: {new_description[:60]}...")
            update_book_description(conn, book_id, new_description)
            updated += 1
        else:
            print(f"⚠️  NOT FOUND: {title} (no description available)")
            # Create generic clean description
            generic_desc = f"A literary classic worth exploring."
            update_book_description(conn, book_id, generic_desc)
            not_found += 1
    
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"✅ Updated: {updated}")
    print(f"⏭️  Skipped (already clean): {skipped}")
    print(f"⚠️  Generic description added: {not_found}")
    print(f"📊 Total processed: {len(books)}")
    print("="*70 + "\n")

def main():
    print("""
    ╔════════════════════════════════════════════════════════╗
    ║   READORA - Update Book Descriptions                  ║
    ║   Removes Gutenberg/Readora branding                  ║
    ╚════════════════════════════════════════════════════════╝
    """)
    
    print("⚠️  WARNING: This will update descriptions in your database")
    print("   Make sure you have a backup!")
    print()
    
    confirm = input("Continue? (yes/no): ").lower().strip()
    
    if confirm not in ['yes', 'y']:
        print("❌ Cancelled")
        return
    
    conn = connect_to_db()
    if not conn:
        return
    
    try:
        update_all_descriptions(conn)
    except Exception as e:
        print(f"\n❌ Error: {e}")
    finally:
        conn.close()
        print("✅ Database connection closed")

if __name__ == "__main__":
    main()