#!/bin/bash
# 这是一个数据库初始化脚本示例
# 如果你想用 MongoDB 数据导入功能，可以使用此脚本

# 使用说明：
# mongoimport --uri "mongodb://localhost:27017/dish-menu" \
#             --collection dishes \
#             --file initial-dishes.json \
#             --jsonArray

# 初始菜品数据示例
cat > initial-dishes.json << 'EOF'
[
  {
    "name": "番茄鸡蛋面",
    "description": "清汤番茄鸡蛋面，爽口开胃",
    "category": "面食",
    "price": 25,
    "difficulty": "简单",
    "cookTime": "20分钟",
    "image": "tomato-egg-noodles.jpg",
    "ingredients": ["番茄", "鸡蛋", "面条", "葱"],
    "steps": [
      {"order": 1, "description": "烧水至沸腾"},
      {"order": 2, "description": "番茄切块，鸡蛋打散"},
      {"order": 3, "description": "水烧开后加面条"},
      {"order": 4, "description": "煮3分钟，加番茄和蛋液"}
    ],
    "available": true,
    "rating": 4.8
  },
  {
    "name": "红烧肉",
    "description": "肥瘦相间，软糯入味",
    "category": "家常菜",
    "price": 45,
    "difficulty": "中等",
    "cookTime": "90分钟",
    "image": "braised-pork.jpg",
    "ingredients": ["猪肉", "冰糖", "酱油", "葱", "生姜"],
    "steps": [
      {"order": 1, "description": "猪肉切块，用开水焯一遍"},
      {"order": 2, "description": "油热后加入冰糖炒出焦糖色"},
      {"order": 3, "description": "加入肉块翻炒上色"},
      {"order": 4, "description": "加入酱油、水和香料，大火烧开后转小火炖1小时"},
      {"order": 5, "description": "待肉软烂，汤汁浓稠即可"}
    ],
    "available": true,
    "rating": 5.0
  },
  {
    "name": "宫保鸡丁",
    "description": "脆爽花生，入味鸡块",
    "category": "家常菜",
    "price": 35,
    "difficulty": "简单",
    "cookTime": "25分钟",
    "image": "kung-pao-chicken.jpg",
    "ingredients": ["鸡胸肉", "花生", "干辣椒", "酱油", "糖", "醋"],
    "steps": [
      {"order": 1, "description": "鸡胸肉切块，用淀粉腌制"},
      {"order": 2, "description": "花生提前炒好"},
      {"order": 3, "description": "热油炒鸡肉至变色"},
      {"order": 4, "description": "加入酱料和花生翻炒均匀"}
    ],
    "available": true,
    "rating": 4.6
  },
  {
    "name": "西红柿汤",
    "description": "清汤鸡蛋西红柿，营养丰富",
    "category": "汤羹",
    "price": 18,
    "difficulty": "简单",
    "cookTime": "15分钟",
    "image": "tomato-soup.jpg",
    "ingredients": ["番茄", "鸡蛋", "葱", "盐"],
    "steps": [
      {"order": 1, "description": "番茄切块，鸡蛋打散"},
      {"order": 2, "description": "烧开水，加入番茄块"},
      {"order": 3, "description": "再次烧开后倒入蛋液"},
      {"order": 4, "description": "加盐调味"}
    ],
    "available": true,
    "rating": 4.5
  },
  {
    "name": "蛋糕",
    "description": "软绵甜蜜的黄油蛋糕",
    "category": "甜品",
    "price": 30,
    "difficulty": "中等",
    "cookTime": "60分钟",
    "image": "cake.jpg",
    "ingredients": ["面粉", "鸡蛋", "黄油", "糖", "牛奶"],
    "steps": [
      {"order": 1, "description": "黄油软化，加糖混合"},
      {"order": 2, "description": "逐个加入鸡蛋，搅拌均匀"},
      {"order": 3, "description": "筛入面粉，加牛奶混合"},
      {"order": 4, "description": "倒入烤盘，烤箱180度烤40分钟"}
    ],
    "available": true,
    "rating": 4.7
  }
]
EOF

echo "✅ initial-dishes.json 已创建！"
echo "📝 使用 mongoimport 导入数据："
echo "mongoimport --uri \"mongodb://localhost:27017/dish-menu\" --collection dishes --file initial-dishes.json --jsonArray"
