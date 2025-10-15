import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Character {
  id: number;
  name: string;
  rarity: Rarity;
  power: number;
  emoji: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
  };
}

const rarityConfig = {
  common: { color: 'bg-gray-400', label: 'Обычный', chance: 50, gradient: 'from-gray-300 to-gray-500' },
  rare: { color: 'bg-blue-500', label: 'Редкий', chance: 30, gradient: 'from-blue-300 to-blue-600' },
  epic: { color: 'bg-purple-600', label: 'Эпический', chance: 15, gradient: 'from-purple-400 to-purple-700' },
  legendary: { color: 'bg-yellow-500', label: 'Легендарный', chance: 5, gradient: 'from-yellow-300 to-orange-500' }
};

const availableCharacters = [
  { name: 'Шоколадное печенье', emoji: '🍪', baseStats: { attack: 15, defense: 10, speed: 12 } },
  { name: 'Клубничное печенье', emoji: '🍓', baseStats: { attack: 12, defense: 15, speed: 10 } },
  { name: 'Ванильное печенье', emoji: '🧁', baseStats: { attack: 10, defense: 12, speed: 15 } },
  { name: 'Карамельное печенье', emoji: '🍯', baseStats: { attack: 18, defense: 8, speed: 14 } },
  { name: 'Мятное печенье', emoji: '🌿', baseStats: { attack: 14, defense: 14, speed: 12 } },
  { name: 'Радужное печенье', emoji: '🌈', baseStats: { attack: 20, defense: 20, speed: 20 } },
];

const shopItems = [
  { id: 1, name: '10 Кристаллов', price: 100, icon: 'Gem', amount: 10 },
  { id: 2, name: '50 Кристаллов', price: 450, icon: 'Gem', amount: 50 },
  { id: 3, name: '100 Кристаллов', price: 800, icon: 'Gem', amount: 100 },
  { id: 4, name: 'Ускорение x2', price: 200, icon: 'Zap', amount: 1 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'gacha' | 'collection' | 'shop'>('home');
  const [coins, setCoins] = useState(1000);
  const [gems, setGems] = useState(50);
  const [collection, setCollection] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [newCharacter, setNewCharacter] = useState<Character | null>(null);

  const generateRarity = (): Rarity => {
    const roll = Math.random() * 100;
    if (roll < 5) return 'legendary';
    if (roll < 20) return 'epic';
    if (roll < 50) return 'rare';
    return 'common';
  };

  const generateCharacter = (): Character => {
    const rarity = generateRarity();
    const template = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    const multiplier = rarity === 'legendary' ? 2 : rarity === 'epic' ? 1.5 : rarity === 'rare' ? 1.2 : 1;
    
    return {
      id: Date.now(),
      name: template.name,
      rarity,
      power: Math.floor(Math.random() * 1000 * multiplier + 100),
      emoji: template.emoji,
      stats: {
        attack: Math.floor(template.baseStats.attack * multiplier),
        defense: Math.floor(template.baseStats.defense * multiplier),
        speed: Math.floor(template.baseStats.speed * multiplier),
      }
    };
  };

  const rollGacha = () => {
    if (gems < 10) {
      toast.error('Недостаточно кристаллов!');
      return;
    }

    setIsRolling(true);
    setGems(gems - 10);

    setTimeout(() => {
      const character = generateCharacter();
      setCollection([...collection, character]);
      setNewCharacter(character);
      setIsRolling(false);
      toast.success(`Получено: ${character.name}!`, {
        description: `Редкость: ${rarityConfig[character.rarity].label}`
      });
    }, 1500);
  };

  const buyItem = (item: typeof shopItems[0]) => {
    if (coins < item.price) {
      toast.error('Недостаточно монет!');
      return;
    }

    setCoins(coins - item.price);
    if (item.icon === 'Gem') {
      setGems(gems + item.amount);
    }
    toast.success(`Куплено: ${item.name}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-4 border-purple-400">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 drop-shadow-lg">
              Cookie Kingdom
            </h1>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-full shadow-md">
                <Icon name="Coins" size={20} className="text-white" />
                <span className="font-bold text-white">{coins}</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 rounded-full shadow-md">
                <Icon name="Gem" size={20} className="text-white" />
                <span className="font-bold text-white">{gems}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { id: 'home', icon: 'Home', label: 'Главная' },
            { id: 'gacha', icon: 'Sparkles', label: 'Гача' },
            { id: 'collection', icon: 'Users', label: 'Коллекция' },
            { id: 'shop', icon: 'Store', label: 'Магазин' }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={`h-16 text-lg font-bold rounded-2xl border-4 transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-purple-400 text-white scale-105 shadow-lg' 
                  : 'bg-white border-purple-300 text-purple-700 hover:scale-105 hover:border-purple-400'
              }`}
            >
              <Icon name={tab.icon as any} size={24} className="mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-6">
            <Card className="border-4 border-pink-400 rounded-3xl bg-white/90 backdrop-blur shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 p-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-3xl text-white drop-shadow-md">🍪 Добро пожаловать в королевство!</CardTitle>
                  <CardDescription className="text-white/90 text-lg mt-2">
                    Собирай персонажей, улучшай их и становись сильнейшим!
                  </CardDescription>
                </CardHeader>
              </div>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-2xl border-2 border-pink-300">
                    <div className="text-4xl mb-2">🎲</div>
                    <h3 className="font-bold text-lg text-pink-800">Система гача</h3>
                    <p className="text-sm text-pink-700">Получай случайных персонажей</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl border-2 border-purple-300">
                    <div className="text-4xl mb-2">⭐</div>
                    <h3 className="font-bold text-lg text-purple-800">Редкости</h3>
                    <p className="text-sm text-purple-700">От обычных до легендарных</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-4 rounded-2xl border-2 border-cyan-300">
                    <div className="text-4xl mb-2">💪</div>
                    <h3 className="font-bold text-lg text-cyan-800">Прокачка</h3>
                    <p className="text-sm text-cyan-700">Улучшай характеристики</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-orange-400 rounded-3xl bg-white/90 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-700">📊 Статистика</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Персонажей в коллекции:</span>
                      <span className="font-bold text-purple-600">{collection.length}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Легендарных:</span>
                      <span className="font-bold text-yellow-600">
                        {collection.filter(c => c.rarity === 'legendary').length}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Общая мощь:</span>
                      <span className="font-bold text-pink-600">
                        {collection.reduce((sum, c) => sum + c.power, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'gacha' && (
          <div className="animate-fade-in">
            <Card className="border-4 border-purple-400 rounded-3xl bg-white/90 backdrop-blur shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-8">
                <CardHeader className="p-0 text-center">
                  <CardTitle className="text-4xl text-white drop-shadow-lg mb-4">✨ Гача-система</CardTitle>
                  <CardDescription className="text-white/90 text-lg">
                    10 кристаллов за 1 попытку
                  </CardDescription>
                </CardHeader>
              </div>
              
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-64 h-64 bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200 rounded-full flex items-center justify-center border-8 border-purple-400 shadow-2xl">
                    {isRolling ? (
                      <div className="text-8xl animate-bounce-in">🎲</div>
                    ) : (
                      <div className="text-8xl animate-float">🍪</div>
                    )}
                  </div>

                  <Button
                    onClick={rollGacha}
                    disabled={isRolling || gems < 10}
                    size="lg"
                    className="w-64 h-16 text-2xl font-bold rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 border-4 border-white shadow-xl disabled:opacity-50"
                  >
                    {isRolling ? (
                      <>
                        <Icon name="Loader2" className="animate-spin mr-2" size={28} />
                        Крутим...
                      </>
                    ) : (
                      <>
                        <Icon name="Sparkles" size={28} className="mr-2" />
                        Крутить гачу
                      </>
                    )}
                  </Button>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-6">
                    {Object.entries(rarityConfig).map(([rarity, config]) => (
                      <div key={rarity} className="text-center p-4 bg-white rounded-xl border-2 border-purple-200">
                        <Badge className={`${config.color} text-white mb-2`}>
                          {config.label}
                        </Badge>
                        <p className="text-sm font-semibold">{config.chance}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'collection' && (
          <div className="animate-fade-in">
            <Card className="border-4 border-cyan-400 rounded-3xl bg-white/90 backdrop-blur shadow-xl">
              <CardHeader className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-t-2xl">
                <CardTitle className="text-3xl text-white">👥 Моя коллекция</CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  У тебя {collection.length} персонажей
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {collection.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-xl text-gray-600">Коллекция пуста</p>
                    <p className="text-gray-500 mt-2">Начни крутить гачу, чтобы получить персонажей!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {collection.map((character) => (
                      <Card
                        key={character.id}
                        className={`cursor-pointer transition-all hover:scale-105 border-4 rounded-2xl bg-gradient-to-br ${rarityConfig[character.rarity].gradient}`}
                        onClick={() => setSelectedCharacter(character)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-6xl mb-2 animate-float">{character.emoji}</div>
                          <Badge className={`${rarityConfig[character.rarity].color} text-white mb-2`}>
                            {rarityConfig[character.rarity].label}
                          </Badge>
                          <h3 className="font-bold text-white drop-shadow text-sm mb-1">{character.name}</h3>
                          <div className="flex items-center justify-center gap-1 text-white">
                            <Icon name="Zap" size={16} />
                            <span className="font-bold">{character.power}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="animate-fade-in">
            <Card className="border-4 border-yellow-400 rounded-3xl bg-white/90 backdrop-blur shadow-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-2xl">
                <CardTitle className="text-3xl text-white">🏪 Магазин</CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Покупай кристаллы и улучшения
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {shopItems.map((item) => (
                    <Card key={item.id} className="border-4 border-orange-300 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-100">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                              <Icon name={item.icon as any} size={32} className="text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{item.name}</h3>
                              <p className="text-sm text-gray-600">x{item.amount}</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => buyItem(item)}
                          disabled={coins < item.price}
                          className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-2 border-white shadow-md"
                        >
                          <Icon name="Coins" size={20} className="mr-2" />
                          {item.price} монет
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Dialog open={!!selectedCharacter} onOpenChange={() => setSelectedCharacter(null)}>
          <DialogContent className="border-4 border-purple-400 rounded-3xl max-w-md">
            {selectedCharacter && (
              <>
                <DialogHeader>
                  <div className="text-center">
                    <div className="text-8xl mb-4 animate-bounce-in">{selectedCharacter.emoji}</div>
                    <DialogTitle className="text-3xl mb-2">{selectedCharacter.name}</DialogTitle>
                    <Badge className={`${rarityConfig[selectedCharacter.rarity].color} text-white text-lg px-4 py-1`}>
                      {rarityConfig[selectedCharacter.rarity].label}
                    </Badge>
                  </div>
                </DialogHeader>
                <DialogDescription asChild>
                  <div className="space-y-4 mt-4">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl border-2 border-purple-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold flex items-center gap-2">
                          <Icon name="Zap" size={20} className="text-yellow-600" />
                          Мощь
                        </span>
                        <span className="text-2xl font-bold text-purple-700">{selectedCharacter.power}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold flex items-center gap-2">
                            <Icon name="Sword" size={18} className="text-red-500" />
                            Атака
                          </span>
                          <span className="font-bold">{selectedCharacter.stats.attack}</span>
                        </div>
                        <Progress value={selectedCharacter.stats.attack * 2} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold flex items-center gap-2">
                            <Icon name="Shield" size={18} className="text-blue-500" />
                            Защита
                          </span>
                          <span className="font-bold">{selectedCharacter.stats.defense}</span>
                        </div>
                        <Progress value={selectedCharacter.stats.defense * 2} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold flex items-center gap-2">
                            <Icon name="Gauge" size={18} className="text-green-500" />
                            Скорость
                          </span>
                          <span className="font-bold">{selectedCharacter.stats.speed}</span>
                        </div>
                        <Progress value={selectedCharacter.stats.speed * 2} className="h-3" />
                      </div>
                    </div>

                    <Button 
                      className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-2 border-white"
                      disabled
                    >
                      <Icon name="TrendingUp" size={20} className="mr-2" />
                      Улучшить (скоро)
                    </Button>
                  </div>
                </DialogDescription>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!newCharacter} onOpenChange={() => setNewCharacter(null)}>
          <DialogContent className={`border-4 rounded-3xl max-w-md bg-gradient-to-br ${newCharacter ? rarityConfig[newCharacter.rarity].gradient : ''}`}>
            {newCharacter && (
              <div className="text-center py-6">
                <div className="text-9xl mb-4 animate-bounce-in">{newCharacter.emoji}</div>
                <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
                  {newCharacter.name}
                </h2>
                <Badge className={`${rarityConfig[newCharacter.rarity].color} text-white text-xl px-6 py-2 mb-4`}>
                  {rarityConfig[newCharacter.rarity].label}
                </Badge>
                <div className="text-3xl font-bold text-white drop-shadow-md mb-6">
                  ⚡ Мощь: {newCharacter.power}
                </div>
                <Button
                  onClick={() => setNewCharacter(null)}
                  className="w-full h-14 text-xl font-bold rounded-xl bg-white text-purple-700 hover:bg-gray-100 border-4 border-purple-400"
                >
                  Отлично!
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
