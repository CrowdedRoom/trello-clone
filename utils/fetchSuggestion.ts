import {Board} from "@/typings";
import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: Board) => {
    const todos = formatTodosForAI(board);
    console.log('FORMATTED TODOS to send >>', todos);
    const response = await fetch("/api/generateSummary", {
        method: "POST",
        body: JSON.stringify({todos}),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const suggestion = await response.json();
    const {content} = suggestion;
    return content;
};

export default fetchSuggestion;
