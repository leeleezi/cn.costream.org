/**
  * Shuffles array in place.
  * @param {Array} a items The array containing the items.
  */
function shuffle (a) {
	a = a.concat([])
	if (window.location.hostname === 'localhost') {
		return a
	}
	var j, x, i
	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i)
		x = a[i - 1]
		a[i - 1] = a[j]
		a[j] = x
	}
	return a
}

var team = [{
	name: '于俊清',
	title: 'Professor of DML',
	city: 'Wuhan, China',
	languages: ['zh', 'en'],
	github: null,
	img: '/images/YuJunqing.jpg',
	work: {
		role: 'Professor',
		org: 'HUST DML'
	},
	reposOfficial: [
		'多核计算与流编译', '基于内容的视频分析','网络安全与大数据处理'
	],
	links: [
		'http://faculty.hust.edu.cn/yujunqing/zh_CN/index.htm'
	]
}]

team = team.concat(shuffle([ //shuffle 函数打乱了后续成员的顺序
	{
		name: '陈名韬',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'lhcmt',
		twitter: null,
		work: {
			role: 'Master',
			org:'HUST DML'
		},
		reposOfficial: [
			'COStream GPU'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/lhcmt'
		]
	},
	{
		name: '王兆吉',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'PixelWang',
		twitter: null,
		work: {
			role: 'Master',
			org:'HUST DML'
		},
		reposOfficial: [
			'COStream Benchmark'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/PixelWang'
		]
	},
	{
		name: '李平然',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'blendTree',
		twitter: null,
		work: {
			role: 'Master',
			org:'HUST DML'
		},
		reposOfficial: [
			'COStream Dynamic scheduling'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/blendTree'
		]
	},
	{
		name: '李新星',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en','jp'],
		github: 'lxx2013',
		twitter: null,
		work: {
			role: 'Master',
			org:'HUST DML'
		},
		reposOfficial: [
			'COStream - Graphic', '前端'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'http://setsuna.wang'
		]
	},
	{
		name: '杨飞',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'innocanca',
		twitter: null,
		work: {
			role: 'Master',
			org:'HUST DML'
		},
		reposOfficial: [
			'COStream - JPEG'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/innocanca'
		]
	},
	{
		name: '余冰清',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'yu583497794',
		twitter: null,
		work: {
			role: 'Master',
			org:'HUST DML'
		},
		reposOfficial: [
			'COStream - Tensorflow'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/yu583497794'
		]
	},
	{
		name: '彭昊',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'PHaoGhost',
		twitter: null,
		work: {
			role: 'Master',
			org:'HUST DML'
		},
		reposOfficial: [
			'COStream','Linux'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/PHaoGhost'
		]
	}
]))

