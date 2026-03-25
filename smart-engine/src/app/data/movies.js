const moviesDatabase = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    genres: ["Sci-Fi", "Thriller", "Action"],
    averageRating: 4.8,
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop"
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    year: 1994,
    genres: ["Drama"],
    averageRating: 4.9,
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop"
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    averageRating: 4.7,
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    genres: ["Crime", "Drama"],
    averageRating: 4.6,
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    posterUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop"
  },
  {
    id: 5,
    title: "Forrest Gump",
    year: 1994,
    genres: ["Drama", "Romance"],
    averageRating: 4.7,
    description: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.",
    posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop"
  },
  {
    id: 6,
    title: "The Matrix",
    year: 1999,
    genres: ["Sci-Fi", "Action"],
    averageRating: 4.7,
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop"
  },
  {
    id: 7,
    title: "Goodfellas",
    year: 1990,
    genres: ["Crime", "Drama"],
    averageRating: 4.6,
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife and his partners in crime.",
    posterUrl: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop"
  },
  {
    id: 8,
    title: "Interstellar",
    year: 2014,
    genres: ["Sci-Fi", "Drama", "Adventure"],
    averageRating: 4.8,
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterUrl: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=400&h=600&fit=crop"
  },
  {
    id: 9,
    title: "The Godfather",
    year: 1972,
    genres: ["Crime", "Drama"],
    averageRating: 4.9,
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop"
  },
  {
    id: 10,
    title: "Fight Club",
    year: 1999,
    genres: ["Drama", "Thriller"],
    averageRating: 4.7,
    description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
    posterUrl: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=400&h=600&fit=crop"
  },
  {
    id: 11,
    title: "The Lord of the Rings",
    year: 2001,
    genres: ["Fantasy", "Adventure", "Drama"],
    averageRating: 4.8,
    description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring.",
    posterUrl: "https://images.unsplash.com/photo-1574267432644-f610cab4fd44?w=400&h=600&fit=crop"
  },
  {
    id: 12,
    title: "Star Wars",
    year: 1977,
    genres: ["Sci-Fi", "Adventure", "Fantasy"],
    averageRating: 4.6,
    description: "Luke Skywalker joins forces with a Jedi Knight to rescue a princess and save the galaxy from evil.",
    posterUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&h=600&fit=crop"
  },
  {
    id: 13,
    title: "Gladiator",
    year: 2e3,
    genres: ["Action", "Drama", "Adventure"],
    averageRating: 4.5,
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.",
    posterUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop"
  },
  {
    id: 14,
    title: "Parasite",
    year: 2019,
    genres: ["Drama", "Thriller"],
    averageRating: 4.8,
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    posterUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&h=600&fit=crop"
  },
  {
    id: 15,
    title: "The Prestige",
    year: 2006,
    genres: ["Drama", "Mystery", "Thriller"],
    averageRating: 4.6,
    description: "Two stage magicians engage in competitive one-upmanship in an attempt to create the ultimate stage illusion.",
    posterUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
  },
  {
    id: 16,
    title: "Whiplash",
    year: 2014,
    genres: ["Drama"],
    averageRating: 4.7,
    description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.",
    posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop"
  },
  {
    id: 17,
    title: "Joker",
    year: 2019,
    genres: ["Drama", "Thriller", "Crime"],
    averageRating: 4.5,
    description: "In Gotham City, mentally troubled comedian Arthur Fleck embarks on a downward spiral of revolution and crime.",
    posterUrl: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&h=600&fit=crop"
  },
  {
    id: 18,
    title: "La La Land",
    year: 2016,
    genres: ["Romance", "Drama", "Musical"],
    averageRating: 4.4,
    description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.",
    posterUrl: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=400&h=600&fit=crop"
  },
  {
    id: 19,
    title: "Mad Max: Fury Road",
    year: 2015,
    genres: ["Action", "Adventure", "Sci-Fi"],
    averageRating: 4.6,
    description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop"
  },
  {
    id: 20,
    title: "Blade Runner 2049",
    year: 2017,
    genres: ["Sci-Fi", "Drama", "Mystery"],
    averageRating: 4.5,
    description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
    posterUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=600&fit=crop"
  },
  {
    id: 21,
    title: "Get Out",
    year: 2017,
    genres: ["Horror", "Thriller"],
    averageRating: 4.5,
    description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception evolves into terror.",
    posterUrl: "https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=400&h=600&fit=crop"
  },
  {
    id: 22,
    title: "The Grand Budapest Hotel",
    year: 2014,
    genres: ["Comedy", "Drama", "Adventure"],
    averageRating: 4.6,
    description: "The adventures of Gustave H, a legendary concierge at a famous hotel, and Zero Moustafa, the lobby boy who becomes his trusted friend.",
    posterUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=600&fit=crop"
  },
  {
    id: 23,
    title: "Eternal Sunshine",
    year: 2004,
    genres: ["Romance", "Sci-Fi", "Drama"],
    averageRating: 4.6,
    description: "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.",
    posterUrl: "https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=400&h=600&fit=crop"
  },
  {
    id: 24,
    title: "Arrival",
    year: 2016,
    genres: ["Sci-Fi", "Drama"],
    averageRating: 4.5,
    description: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecrafts appear around the world.",
    posterUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=600&fit=crop"
  }
];
const allGenres = [
  "All",
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Musical"
];
export {
  allGenres,
  moviesDatabase
};
