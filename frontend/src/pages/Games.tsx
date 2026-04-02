import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Gamepad } from "lucide-react";

const games = [
    { name: "Tic Tac Toe", path: "/games/tictactoe", image: "/games/TicTacToe.png", category: "Strategy" },
    { name: "Rock Paper Scissors", path: "/games/rock-paper-scissors", image: "/games/RockPaperSiscors.jpg", category: "Classic" },
    { name: "Connect Four", path: "/games/connect-four", image: "/games/Connect4.jpeg", category: "Strategy" },
    { name: "Snake Game", path: "/games/snake-game", image: "/games/Snake.jpg", category: "Arcade" },
    { name: "Brick Breaker", path: "/games/brick-breaker", image: "/games/brick.jpeg", category: "Arcade" },
    { name: "Tetris", path: "/games/tetris", image: "/games/Tetris.jpg", category: "Arcade" }
];

const Games = () => {
    const [hoveredGame, setHoveredGame] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = ["All", ...new Set(games.map(game => game.category))];

    const filteredGames = selectedCategory && selectedCategory !== "All"
        ? games.filter(game => game.category === selectedCategory)
        : games;

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-auto">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: 'url("/games/gaming_background.jpg")' }}>
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content container */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <Link to="/relax" className="flex items-center text-indigo-300 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span>Back to Relax Zone</span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center"
                    >
                        <Gamepad className="w-8 h-8 text-purple-400 mr-3" />
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-lg">
                            Arcade Arena
                        </h1>
                    </motion.div>

                    <div className="w-24"></div> {/* Empty div for flex balance */}
                </div>

                {/* Category filters */}
                <motion.div
                    className="flex flex-wrap gap-2 mb-8 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                selectedCategory === category || (category === "All" && !selectedCategory)
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40"
                                    : "bg-gray-800 text-purple-200 hover:bg-gray-700"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Games grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {filteredGames.map((game, index) => (
                        <motion.div
                            key={game.path}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -5 }}
                            onMouseEnter={() => setHoveredGame(game.path)}
                            onMouseLeave={() => setHoveredGame(null)}
                        >
                            <Link
                                to={game.path}
                                className="block h-full bg-gray-900/40 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/30 hover:border-pink-500/50 transition-all shadow-2xl group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 transition-opacity ${
                                        hoveredGame === game.path ? 'opacity-100' : 'opacity-0'
                                    }`} />

                                    <img
                                        src={game.image}
                                        alt={game.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    <div className={`absolute bottom-3 right-3 z-20 bg-pink-600 rounded-full p-2 transition-all duration-300 ${
                                        hoveredGame === game.path ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                                    }`}>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="p-5">
                                    <span className="text-xs font-medium text-pink-400 mb-2 block">
                                        {game.category}
                                    </span>
                                    <h2 className="text-xl font-bold mb-1">{game.name}</h2>
                                    <div className="h-1 w-12 bg-pink-500 rounded-full mt-3 group-hover:w-20 transition-all" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Games;