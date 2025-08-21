"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, RotateCcw, Trophy, Menu, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Player {
  id: string
  name: string
  scores: number[]
  total: number
}

interface GameHistory {
  id: string
  date: string
  players: Player[]
  winner: string
}

export default function SkyjoScoreApp() {
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [currentRound, setCurrentRound] = useState(1)
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const { toast } = useToast()

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        scores: [],
        total: 0,
      }
      setPlayers([...players, newPlayer])
      setNewPlayerName("")
      toast({
        title: "Joueur ajouté",
        description: `${newPlayerName} a été ajouté à la partie`,
      })
    }
  }

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((p) => p.id !== playerId))
  }

  const updateScore = (playerId: string, roundIndex: number, score: string) => {
    const numScore = Number.parseInt(score) || 0
    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          const newScores = [...player.scores]
          newScores[roundIndex] = numScore
          const total = newScores.reduce((sum, s) => sum + (s || 0), 0)
          return { ...player, scores: newScores, total }
        }
        return player
      }),
    )
  }

  const addRound = () => {
    if (players.length > 0) {
      setCurrentRound(currentRound + 1)
      toast({
        title: "Nouvelle manche",
        description: `Manche ${currentRound + 1} commencée`,
      })
    }
  }

  const finishGame = () => {
    if (players.length > 0 && players.some((p) => p.scores.length > 0)) {
      const winner = players.reduce((prev, current) => (prev.total < current.total ? prev : current))

      const gameRecord: GameHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("fr-FR"),
        players: [...players],
        winner: winner.name,
      }

      setGameHistory([gameRecord, ...gameHistory])
      setShowFireworks(true)
      setTimeout(() => {
        setShowFireworks(false)
        resetGame()
      }, 4000)

      toast({
        title: "🏆 Partie terminée !",
        description: `${winner.name} remporte la partie avec ${winner.total} points !`,
      })
    }
  }

  const resetGame = () => {
    setPlayers([])
    setCurrentRound(1)
    setNewPlayerName("")
  }

  const getPlayerRank = (player: Player) => {
    const sortedPlayers = [...players].sort((a, b) => a.total - b.total)
    return sortedPlayers.findIndex((p) => p.id === player.id) + 1
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 relative">
      {showFireworks && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"][
                  Math.floor(Math.random() * 6)
                ],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-yellow-400 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`,
                fontSize: `${12 + Math.random() * 8}px`,
              }}
            >
              ✨
            </div>
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`confetti-${i}`}
              className="absolute w-3 h-3 animate-spin"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 border-2 border-primary animate-pulse">
              <div className="text-center space-y-2">
                <div className="text-4xl">🎉</div>
                <h2 className="text-2xl font-bold text-primary">Félicitations !</h2>
                <p className="text-muted-foreground">Partie terminée avec succès</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground">🎯 Score</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Suivez vos scores et devenez le maître du jeu !</p>
        </div>

        <Card className="leading-4">
          <CardHeader className="pb-3 leading-3 font-thin sm:pb-0">
            <CardTitle className="flex items-center text-lg leading-7 sm:text-base gap-2">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Ajouter un joueur
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Label htmlFor="playerName" className="sr-only">
                  Nom du joueur
                </Label>
                <Input
                  id="playerName"
                  placeholder="Nom du joueur..."
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                  maxLength={20}
                  className="text-base"
                />
              </div>
              <Button
                onClick={addPlayer}
                disabled={!newPlayerName.trim() || players.length >= 8}
                className="w-full sm:w-auto"
              >
                Ajouter
              </Button>
            </div>
            {players.length >= 8 && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">Maximum 8 joueurs par partie</p>
            )}
          </CardContent>
        </Card>

        {players.length > 0 && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-lg sm:text-xl">Scores - Manche {currentRound}</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="sm:hidden">
                    <Button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {isMobileMenuOpen ? <X className="h-4 w-4 mr-1" /> : <Menu className="h-4 w-4 mr-1" />}
                      Actions
                    </Button>
                  </div>
                  <div className={`flex flex-col sm:flex-row gap-2 ${isMobileMenuOpen ? "block" : "hidden sm:flex"}`}>
                    <Button onClick={addRound} variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      Nouvelle manche
                    </Button>
                    <Button onClick={finishGame} variant="default" size="sm" className="w-full sm:w-auto">
                      <Trophy className="h-4 w-4 mr-1" />
                      Terminer
                    </Button>
                    <Button onClick={resetGame} variant="destructive" size="sm" className="w-full sm:w-auto">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="min-w-full px-2 sm:px-0">
                  <table className="w-full min-w-[400px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-1 sm:p-2 font-semibold text-xs sm:text-sm sticky left-0 bg-background min-w-16">
                          Manche
                        </th>
                        {players.map((player) => (
                          <th
                            key={player.id}
                            className="text-center p-1 sm:p-2 font-semibold min-w-20 sm:min-w-24 text-xs sm:text-sm"
                            title={player.name}
                          >
                            <div className="truncate max-w-20 sm:max-w-24 flex justify-center items-center mx-auto">
                              {player.name}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: currentRound }, (_, roundIndex) => (
                        <tr key={roundIndex} className="border-b hover:bg-muted/50">
                          <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm sticky left-0 bg-background text-right">
                            M{roundIndex + 1}
                          </td>
                          {players.map((player) => (
                            <td key={player.id} className="p-1 sm:p-2">
                              <Input
                                type="number"
                                className="w-16 text-center text-xs sm:text-sm h-8 sm:h-10 sm:w-full"
                                placeholder="0"
                                value={player.scores[roundIndex] || ""}
                                onChange={(e) => updateScore(player.id, roundIndex, e.target.value)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="border-b-2 border-primary/20 bg-muted/30">
                        <td className="p-1 sm:p-2 font-semibold text-xs sm:text-sm sticky left-0 bg-muted/30">Total</td>
                        {players.map((player) => (
                          <td key={player.id} className="p-1 sm:p-2 text-center">
                            <Badge variant={getPlayerRank(player) === 1 ? "default" : "secondary"} className="text-xs">
                              {player.total}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-1 sm:p-2 font-semibold text-xs sm:text-sm sticky left-0 bg-background">
                          Rang
                        </td>
                        {players.map((player) => (
                          <td key={player.id} className="p-1 sm:p-2 text-center">
                            <Badge variant="outline" className="text-xs">
                              #{getPlayerRank(player)}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-1 sm:p-2 font-semibold text-xs sm:text-sm sticky left-0 bg-background">
                          Action
                        </td>
                        {players.map((player) => (
                          <td key={player.id} className="p-1 sm:p-2 text-center">
                            <Button
                              onClick={() => removePlayer(player.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {gameHistory.length > 0 && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Historique des parties</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                {gameHistory.slice(0, 5).map((game) => (
                  <div key={game.id} className="border rounded-lg p-3 sm:p-4 bg-muted/30">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                      <span className="font-semibold text-sm sm:text-base">Partie du {game.date}</span>
                      <Badge variant="default" className="self-start sm:self-center">
                        🏆 {game.winner}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm">
                      {game.players.map((player) => (
                        <div key={player.id} className="flex justify-between bg-background/50 rounded px-2 py-1">
                          <span className="truncate mr-2">{player.name}:</span>
                          <span className="font-mono font-semibold">{player.total} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {players.length === 0 && (
          <Card className="text-center py-8 sm:py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl sm:text-6xl">🎴</div>
                <h3 className="text-lg sm:text-xl font-semibold">Prêt pour une partie de carte ?</h3>
                <p className="text-sm sm:text-base text-muted-foreground px-4">
                  Ajoutez des joueurs pour commencer à enregistrer les scores
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
