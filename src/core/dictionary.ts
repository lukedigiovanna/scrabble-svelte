const all_words = [
]

// put words into a hashset
const set = new Set();
all_words.forEach(word => {
    set.add(word);
})

export const hasWord = (word: string) => {
    return set.has(word);
}