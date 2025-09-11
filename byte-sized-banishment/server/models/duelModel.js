import mongoose from "mongoose";

const duelSchema = new mongoose.Schema(
  {
    challenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    challengerScore: {
      type: Number,
      default: -1, // -1 indicates not yet played
    },
    opponentScore: {
      type: Number,
      default: -1, // -1 indicates not yet played
    },
    status: {
      type: String,
      enum: ["pending_opponent", "pending_challenger", "complete"],
      default: "pending_opponent", // Waiting for the opponent to play first
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Duel invitation expires in 1 hour
        return new Date(Date.now() + 60 * 60 * 1000);
      },
      index: { expires: "1h" }, // Optional: auto-remove expired duels
    },
  },
  { timestamps: true }
);

const Duel = mongoose.model("Duel", duelSchema);
export default Duel;
