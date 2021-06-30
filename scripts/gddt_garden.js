/*
version 0.2
Author：telegram@Anti_scientist
github: https://github.com/Antiscientist/quantumultx

使用方法：
1.打开高德地图，点击首页-更多工具-领水果，选择水果并完成初始教学。
2.添加hostname和rewrite
3.打开高德地图即可获取Cookie数据，多账号请重复以上步骤。
4.Node使用，请添加GDDT_SESSIONID环境变量，多账号使用&符号分隔

[mitm]
hostname = *.amap.com,

[rewrite_local]
https:\/\/.+\.amap\.com\/ws\/.+ url script-request-header https://raw.githubusercontent.com/Antiscientist/quantumultx/main/Scripts/gddt_fruit.js

[task_local]
15 7,12,18 * * * https://raw.githubusercontent.com/Antiscientist/quantumultx/main/Scripts/gddt_fruit.js, tag=高德果园 ,enable=true

*/

const $ = Env("高德果园");
if($.isNode()){const { exit } = require("process");}
let sessionIdArr = $.getjson("gddtSessionId") || [""];

let Cookies = {
	"taskList": "https://sns.amap.com/ws/activity/xiaode_garden/task_box_list?ent=2&in=DCBFrNOTpV4zcdL6oAzkmEDYdj7Rx39iZMerwtsrQ9vmfCZ5brDf253QNGprg94IWJUjz%2F2qoMQdLtWIgIvvpX8X3Y4Zg2JTAVnZ67ATLfveTsO3Ly2qGpCodSwwrfDTunEBtQKPcB%2FTT167zmtD7YHjlCjlDm9EItuGRxav9loN%2FBduITVaIkWeh1l%2FH6KP1AtUPDfURKeYwQPjRmw7yY%2BYr3PPpL0kSTkG26vwIOPar2Ycz%2BNDH86dEwT3sYBYeHZmM6yxoSL0wxjmPmAfdyohNXXTuCh5p37ll%2B2y%2Bl%2Fbn%2Bw8pYoX%2B5ynWnlcCzJFMxE%2BhFIPruZM4lwO6%2BCat7KovFwfEvLIuJETbt%2F%2FFQcFRDFdFRnzqmWQUmT9yaX7c%2FAMrGtZFKMwPE12e6%2Fd9N%2FopqbPZHfxxQYjPJzXsKZjghdGtTN1IZA9ucRCDmCE3pug0lDK9EG%2Bomi34ay5OHHH55WxiNfbIySV4j9UcIN3Bu2rXCQ9JCYRMZdL7X4nqRstuJmTZki%2FKAgpVgV6L5YaTXVEI5Mk8JD4a%2Fj0D%2BqRozuXN1VtDA36KpSGXG%2FYKxiLJ9XyCAU6jvI6bPEmhgHlrSyS11eblLb%2BZjnr9jmseHalJ5hdLeAIvjicyHRnyhvqhLYqKabkU%2BTePuslX8Fy62cWGtDG8FsCxDEzDJAA%2FwryIifm3AMQnmN3FrlpfGrxa6RZJAdGnJF%2BMggaZytr9TVeGI04tXw1HpifpSMb%2BY1lBKJjRExZfQUvJAiuJNzXXxfoHeJdFUTrwTDV0U8lc97k0gS5%2BMTvwNmj63Z9FKKnONQdZReLonjt9QqC8XBh3hcT4e7kqXjhtHbEHxj0JCdKimgQcKVNv9lT6olthrqsALIFpJFgBSYWU0A0PyOeseC7DQO1SHU12%2FbImXvpQWY1LrXJnSFOWUO6JCYk5%2B1xd2Hx7FtP32PH1oLGNX2LF7rtMZVZZRSzPcKXxTmsCegFQHJHe5riOHiH%2BdeTRF3oZ8TRBFOdU4Xf3wyEKOTsJXi5NnCgrHsCpVj3kIPcBc7nzvEyZN%2Bg1Q%3D%3D&csid=7FEC6BFC-F78F-424B-A44F-ED0124770FA8",
	"waterURL": "https://sns.amap.com/ws/activity/xiaode_garden/watering?ent=2&in=5RLyjhMGRm3GnQExxrSAiULCx%2Fp4TbFz9ZXNnk8yzvw4O4q1uTMmAYb46pz9yO7xuHXqan8sX2Vn8I%2FnD5eB1vMINLUUXzF1Z5ktbABUYV7S0oHbUvEfe4Sl3ZYxkp7V9z%2BqoZEMX9oEjywYanufDQbxUKedIuimX%2FaLD%2FJcxx%2Bnm2B7F6w2NHEF5DyQgkPQkEswlbM%2BYJhdhlLgKHJlUD9KUPliHQttpaRh%2B8BbAe09A9BUANNSq6oXQ5sb7DFSjcvVIqAdrf4PxYw%2Bt3lnghrZTajR6znMpQE6ExP5AnDhRKSHDGUDZ3ACLrDhENmIfbQNG2vEJXSGlQkhAC%2FTueXhzj%2BK%2BrAKzzrnoVFNUP12bMOmFG1bXgnKybRBwzYwdFMcK%2B3jbDapMtwNJA9ik4XdWD6us6qsaw%2FYErjF5c3n1Ioo85fURNuqceb3qHTFTqxsx%2BzHZ%2FM5KijH5cfTJCJ%2BWQEcEsIcBdbhxTitcdY4TnICjzIFtoW6euII7lgxhzSLISWUaoAUx0FeB%2FmN1dYV2uXUsPsT4MhcGBrX0dofA16Psba%2BZxTkJ6mFONlwGsebnY8OhGF%2FdgYNBP%2FN4w4sdMQ2%2Bo0291BW1awXsixkXUBXHAn4zZBBTdsSPHupjvIJ5iFVFCmm3JcWIhhw2lTV4Jodu5iSph0jZwOZ7IkycBBs6RLm0ftrMk1Fm%2FTS1VRvuUdFTsbuWSLd2oyqHIFEHtvCmFFCzLm2S95lz7c1V0L1qosKkWLDPqgtB1Vx56zvbV%2FsKmCKUhMwM7BAAZvCWUitBHJsXDg60W%2Fn9%2B13jd3YvhCTd78nrpWvWT6RDvzEsxTxr0Z1aThCYa9EO1UPOFjssXauRHbyrlfi1oZUf5QrAAz2YXKJ2kHRfzGoBYMpf69DJloePYP%2FU4T5Dm3Iy3LJnDhptLahmDkjmJSaEp9KXzXdz4CgJtsIpM0hjJXYxdPQ31ieNH%2BIc6Bn%2BP%2Fj0Mu%2Ftjs9RhHcHspVmRRxCc0JC9A37K6HKWMmZnp%2Bq3Aai2Z7rRI%3D&csid=93B68073-FE98-4451-8987-8B11A54E90B2",
	"taskBonusWater_30":"https://sns.amap.com/ws/activity/xiaode_garden/task_rewards?ent=2&in=o8ONupm0p%2ByHwLB9YcMFEMlDyy0hSdWCqRwcR7OjJ4Kq9IAsfIzYkxYfFoYWTE0RMIlkjs%2BFn8BpOw0tYwc%2BuALiV1ZnvT%2FCQSMEQ2m5BWUTD70ZZ1ncedB71B43lZ8druKTsdL%2FpOAaK7sS1xV2OxJDzlVXOEBhRopFMZUBmAZV19o28pbUHPYpMWcPwx4Kcx6a90HAfDY1LidQMlOOe9rATLuvmBJXDqONHp1lAv72%2B4MMRM4TaJKddwsPWD%2Bx1L0wSF6J%2BNiPmGzsqyTWeEnXYGMiQBkn0%2BRgaxPbMhKf2WYksJnjmwGt%2FZPyYgYaMW1iit6DOmPbM%2BVwMRPwPRznCGIGFjzIHZGVkq8O2aRMGncdXv0pSV%2FuoJHOW5jcMl%2FAWF%2FRE6Wf9kUkwIuMNmO49%2FXlffxo%2FHojuEHBOX%2BBpbjOebU0XrrJCTCDyj3i0x4nm4lAWQ8%2BajDwTtHKJZ4cfhbg5ur9I4cgXxtw2qUtYtZECAIUhGInNB%2BrO0zO3IAo56Jfvz9yuerBlubCqykc0g%2F2pnysKiNy5KazEscv1bE9bnQNV1SXellbYxIRJI8ZXKOVgAUwtJntpFKBHJ88tiUocBTyTTR2EztUs2BS80bsdPbsYzNSnQjLRDTeuz977uu9AuigrLs2oBjTfib2uMvW8nClbblMfdoCBoTk7gIjnFcyJguB54kPPZAgryukqv4JYxP9nTAl13cQaddOT83BkusODCTs1Fii56Zlof%2BIUgwGnmfnVM3KYTFsVcTEsDHScLDwtLY%2BP%2F5rVfJLxyrLSi2bCf8bdNXvviBbESZD11jKc5FZLYCY%2FLqaiIx3pPpoOnFh9C7Wo%2FhZraHfeta9y1DV79RozpxlZT9cI9ahhnawJg3PiqEcBh0CrIV9BUJ3BJV9kfSOsujlOnrkwSQnTkfbC3AQCpMW7RlI7%2Ftb%2BRr9tUrCzM11U5LXThYYbcjiKbbGa57nOWNk9OvUaLHCks0FjN9Az9oWbqdsLp%2F01ldvXvETkY5SUuCuv%2F2c6ElPXylEwe%2Bak2CBLWAjdPLQfWxf0RYinivzEJ7ZD5lCa54b0cjGKhpAI6xZ%2BiP1YBK6AlhWw%2B1zyooSaA%3D%3D&csid=1CA6F58C-2996-4EDB-B162-AE12DC4DA56D",
	"taskBonusWater_70":"https://sns.amap.com/ws/activity/xiaode_garden/task_rewards?ent=2&in=nArYrYKGgTRDYCvArE%2BA0MoTU9tnauNhYSnr0ClD%2FVSLg3fTP8h1VV7vQWp1iQ%2BkoTSLbIbWw8NRfeCzctBZqeceziBhuWOC1JDz0vi5AS2Qb5bj76YVddBeMJFSQB169St%2BB6vNpDnyfz6MAhLix9wEhrHzeoMJlx%2FaHte1DuGPWW%2BouZTXsJz9WQqUyWrGFL1xQSvphrQw1XfAzMcKRXF62lSTi1p4k7OsOes2nFUzCh0X8zoMnmbw37zNyTSgUKBIdG3xMaxx9Zox9yssnxqhpsk97FOSA5q3lM4SSVX4O1q1AFWzTwUNU3f%2B21lZ69JuKWXXsORPp5gfKbZWojxovkOPnNKsUDpa4XnuajomFMR87jPh3cz7w%2Fd0ia1sU5V8SaPEgCvlAe0dFIwx6PlOwOwLNzOhc7gsJO5vJKkEnkle4rKcew700YEaKRPW8EBCNT205tpYg%2BRvcTqcsWqXE7%2BU80w%2BU51oRMwSm7iHvwAge64JUfLgythe%2B%2FOS283eLu58eVFWMhrtCtg7CdCONfhjgSjYqrOYkqFkOQH2iSC4UsMQFx5sgd9SRY6BWbFI7MqupghNU03BPLpY6Gw0qhfjvWJWYoSpLO1V0vdJYNEGellFGfyVjkyDSA0xrYE4LSEN0Qhp45s8vVl4n0FyztSy9WPiALMH1uOXNg8vE19xn2HnjXa8CFIjNvLkjYJ0DBraFMr0woWSyrzoiXT8MfAvm5UKywPvvyzIe2lSlcggjKdYY2UIy%2BXBSeAF1pLx052wAHZYkpqB3Bf59RVx0NFTGx3SAZfz%2Fb2XuseN%2B8SK%2FYl8k4bEhiS%2F%2FLFlMTmIcH6UELzm84kNKG3AjvmiQ%2F0tTC7FMY%2Fyri%2Bybb8nuuRG%2BpvXWmpSiT5HD0PaFjm3wUwi4DF285Kh%2F9PVqGdQRtvqZ8alvd5OFniVzz8JDqHCdRJWf%2F8lRR9cCu8U0WStjsibcq4wparTEG9m4DDrH5iI3vfC%2Brfsfs%2BHh2TsjdAwfR%2BUT6a%2BY5lbJlzWQ3dqliHE9ypsXWii8QNB0zaHyus5bKksFhFhkIKjDrFspuraqQjSelOIxMMSXSrTmVWz%2BaVGL9PGs02L83466Q%3D%3D&csid=E13DEDA5-CFA4-42EC-BED3-313E18B8DAE8",
	"index":"https://sns.amap.com/ws/activity/xiaode_garden/index?ent=2&in=cFZdWI9uVMhxnPgYI6NknC7xjPTr%2FIEcAnmbBhzP5QeWaKzFQwlaRjzcvApfdZpdNPyxiNWd3M7BGSmbNpNl5KqnxtSLhQIGjQ9L7SdRxusoTKxQBwo%2FjlaLLC2ZxofTDkgCLUgpIapOvA66yF8mBAQIOA0ZWaME7e9VHDxtZ7EEMX9W4KTy365mnzvQ62scl3v19ca36U87l%2Biu7vB7krc3IWy7aqzRLS0p5iakmktP5f7Za9jcvtU0Lhu2WRg6zrgMQ1Bj8HSPDtumFXxy300qkAA2BSeAqTpZ0%2BSql7KFUHDqxiLHbSHuglgXMnxual5eNqLH19XEOIcqzfTAKs%2FUF7KIbxsQuiUN4hSuQ59LTGQ%2Fum%2B1hQ4QQcJg%2Fkza%2BsS9hemWmr5a5nCNNr1vjE5xv0K4hmeI4aSo6Q7xJiY7NCvxWFYPC1TFWwAgIfKRNE4HdUfMUxSMkzLfGB9nDn8OyGhyPfV%2F%2BBeWox8r6VbDQydIZDV8BXb5x1EDDJpydPa2NwsT2Dr1K8ip5fKMnLUQJi7P5nuPHqHTB3r%2FqPFH2sHOilE3hz42ZAea0%2F%2F8wSB6DXx3YLuvRkDMpg9afwrG1R6UFJeyOQoznJvMTXJMEkbtYSJvwMn78zpKrReJ2kvyJ8FeddpWN6DjGj%2Fx%2FltlptwXejntSmrnKm966fsZmRq%2BBIizX9uTr867po5AILs9Li9vSQ46TT2huN6yDJpiePx1MxZwvfnbp3I5JSJPNnbriLLKEnQsEzb2%2FCwKOxcLmqyiL0cr6r8ysq9TnoiowZJZyabttqUyug5phOYfqnDEUzySwI44S0BCFibEuMtuQU7bLuvbEuYdZ%2BZ%2BSxTJtwMSxZrmfK8FNy7g7%2BVN1r5IV2rDOP7qGtvMQyfXEjtbHrAWvXhPHg4TQpEtSYXUC%2F5Ih7udIQANh1kY9kPUAQjAPbtfvBtF4E5apMcL%2F9aZztLeCes9PfI%2FX771vmKoxWoX5xJGZiMhcN1eDl3o7nmLWsPlt%2Fr0vuJ0sc24etSNOTQG4pENdsCT&csid=17B74A45-6C00-4C8B-A8A4-B9091AB374AC",
	"signListURL":"https://sns.amap.com/ws/activity/xiaode_garden/sign_list?ent=2&in=iPhC%2FQMB4eAR8eBnkeHRslS%2Bz8N4QxMF455HYWhPc9Ho6e4CAtZj27k2fna95AVKKz6EDYB4drblDegtX9iv4u7UTtMqWkJnf0HfnOqB4AhyPk1nGSY93%2BnHI%2BMOQ1veWDfoTjo94BMoHG19etk4wQWrJkNdLA5uaR9HRsH4o1GZZ8xVOb87Y3Xj%2BiV%2FaBbAIefUhUmhhDXJfPSqbg5GV%2BPwZ%2B6TvgUQYVDQaI%2BCwFyT51%2BhHRanRRif1spw47501W4s67t6ePo4T4KAkT%2F7t9pyIL08MfM8SpngecnDMmKMqpGVrbLe1SVa0x5jZVBCI4ZQnZPWWdzPIH9YRG0YuWLaqdDiXlCYdzngwjbuEV%2F4NjTb5xqqTu8kLD9ktnesVTpAuEpMgb3o%2B2Yh9E0k13NwjzZpAufEn64QcjthuZvn7dvOPHzFU4M0d8WMl5868TA0K3N1ohuKkycMeItH3LugfalBctZx9LeFuKed6AIqq9nItEYuvlOVu4lgXtby0VHFgMEKH2J86C13ofIwaDeeIL6U6eNcq8QNZLUpEF%2BLEh8AAJrKSZXrjNhnurhchDnuBigAIqfpEbqX3OEDV3LMSPDUaH8XL11HUSMz6lJkdfA1zSDsFxOv45%2BUBMZwGrVvfiljYm6Q2zp474zNXwR3S5V6q9lWvnJ49bqz4wSpFH%2Bl8PSxdaoxPXHdWieoBdQvmCTolV1jEu96%2FQQ1Gai5Mc1egdY2TuAu2Qu5ahUWCIT3Ln%2FQv4uHqqpfPT2u8CenedV4aSO%2FxOGlWIVtUm%2B%2BUQtEQ%2FYkSxWX5Eb7Lcq0uFBvxaTgTOBpsrqKddQN5dAkcdmKW%2Bt0pSfDc19BbozCE27HLvV7CNv5SvDwAyFWSDBaoSo9Cw0c%2BeYR2hOLI9b54Xn2Yu0tuFOS3rGv7Su%2FieCaNtkvJeuSdG9PkxwxC30IRf%2F4Chr0vuo5HB8LTta3ySAwKpfFUaz5GrUXNcDXPcz1tNSzBDjer1FXPjpkBhEvB%2FRCkasfuk7hxvRG1mE1TOxaYASU5lr1%2B4aabqRoUExNaRHJjERWuDG%2BzYY%3D&csid=ED9B3780-F656-4381-A448-EC7F72C065F1",
	"sign":{
		"id":31,
		"title":"签到得水滴",
		"reward":"https://sns.amap.com/ws/activity/xiaode_garden/task_rewards?ent=2&in=r%2B8h4HmOINTJJ7T7N%2FF7Rk41O9gxUYYqHJtYPIanU0lkGcJvnIXia5VXuFvJgyrKeqCg5MoZSqT71x%2B%2B%2B4BS07R2CGfUNmcZUTOJzzSt7RobpqYCIsrPV7Hvc%2FY8bufbL%2Bupj7p95YLi%2BQJd%2Fc9GboXmxsQ15bS2VegJW%2BDMvtvFxGAS%2BHv0WuLNHdMu6ytrR3Xa4jmFyi4DkIj7mJsvFkZdupjoHuySaW1xvBbbthC1wiOTpYnyNu31xIat7RndJSkQK2iRUlc%2BtwMkoTVtxatnPWJsx7nAa3Ek2KoAsVUWn2dpPahWWzaVj3e0gvg%2FYDQNjjhuc2e%2F9d%2BvHOBAmfz%2BUJfLdGj6omglov9122WWMpWNuPc5WYtYa4hJ2WO8%2FH85WUrItNfbSIaHN54KOMKzVzVPih0hspBRrL2kraHWK2Fxj40yXDRavl%2Fxy242rKfpdiWNnzqtowQSpxD%2BjOzmmTcYwA%2BUidtwbzgCfN%2FK2rZWNEyU1K3%2Bhc00ZySY5vGlnHo6QJuB8FEfiNPaiuwjDNwepbHMLEr4VK7EwnjvPhaMZFkYIzoErsertbUTnZmaDFNuD59OXOMZ4jyrC2DO1xsDfRky9gz0hhOdufIXNd3JReVsY2R94XyrMWMwzqKI6dpgOxAC0wn8qO1rb%2FuvZcVb6CRoezfwGIRZYpxHQurYERRqR53vwds0jmEGmSDDp2BwKHg0CQV4TSaYXorMUPgm1hW6ulvzFT7ARiiAxVXHnxNWEUGKVCIxsy0oQCYh%2BIHWcZXLd9h%2B0flN3Uv8nuL3dKJGAJNp5kOOSEbfHj9yfmCK5aWT%2FfbwMAZBcdjZnlRJelQraF1uYIJU6gQaAZYN0BRoLyo4sw8S9jPsNzO9Vz3KT08QRyVHw7l%2FURN2HUjW2%2BTWui1%2B6FFlpJwTFS70cwKdLsPBq9Blw4nq6Lp4yEwk4dkNoUjyly0ZY0dVJyME8gL4HabUlBuQTnvy7ebB6aWxONYjvDJPNomA4BG5KJT8ff0j2r4MG%2B9byNOn9buhcLXpynMt43GdtdBm5VZgvVBZTBZRmFsbfWyB9xNCCUDAbyXy2pS319VoaSQfuERl%2BYY%3D&csid=BC112B24-9EDB-4E1F-8CA4-AD7D97AEEF97"
	},
	"waterBonus":{
		"id":33,
		"title":"浇水得水滴",
		"reward":"https://sns.amap.com/ws/activity/xiaode_garden/task_rewards?ent=2&in=j0fR2Wv%2Fl4dKhCEo7b1EN6LobZkikVGnoubYvQwEFCMk5u9nmCIRsBYL%2FDOC%2FJYat9PPSC9BmE3unH0Gfp6Wg7FWB%2FBQAb8V2sD0zf3NnvMdTshR5TiiFkhkNLDRIk%2BLrBuXFupzQ1NxS7K9y0g%2B%2BI7pW7zvWq8RHRRQAm2jecHsXacSzgZsgI3uNvB648w%2F3n6Fa7KqjUALSP0RNFtrtVhZ8%2BaKKJ6%2FkIjaG6Kjfr47SBpuNBOPfes7s5dRDTNyhr%2F%2FBvc%2Bp%2BOBcoumjHuAtx1QycRybUtGInt8t%2F9%2FdvcMmd%2BhITJHFRk9f16q2zRIXavOHjw0z53MFF5hKOQVHoHkY4ijiYjT1Zu4UnjKb%2FJZClGSW1%2FMyWAp2rwjNsH7gnurktokQ5zEM9PGTQ0EJj3sWxO1pLJSB8RnTbn1Hk0H9riF1Qzuc2dxkJiehHmBOSIuNuZmP5wDTNweEIkXlJHeF69queKYbMApiFasyCzE1SFS%2BxuOzNd7JtApFMa5wjOkLYCA7WypCm25TNgg12AMsVCEQKBT7FPPrfokmg3fmUEJpkLEMwU4FDsGGIbSSFM0GIHsKkRybu%2Bkx28EVn%2F2VVolI05OHVtRD2Rax2WLgq1VA%2BxQfb8v3OLABrs0b%2FwC1jyCNQfuXhDKVU3H4BtuAnUP9lDrYhRg2uylYCRhoMjT2iSrpA6gcy3mNPV3V%2BR0%2FIV%2FUIOtBgWUdRcfar8kKk%2BwaNRnPZ086OVtGAZamOOFSgWF%2B5pa3vCyASuwWnmfV5qFoy%2B3L8B1BT%2BjViCm%2BRrUzkgd7UWGrUuomeqP%2B%2Fv22XoQgTt2Kiwx79DBmYcx%2F0ebctColUlH3xtLrlNropiDRH4C0ICwA8FbXHtIg0XecEe0RH%2F%2FBsDSZzdvNq8r9UxsFlbmzUWn7rOi3NZQzw4EaaEHUyt%2F9wJ6sYIVJ5sSXh%2BFntlMi%2B0ILmQiwipdBfsP%2BUorW6MUbprq%2FbtIVvuGsb379ZYLr%2FtuDn%2BAuQMY4LI%2Fo4ClcnOE3CFnXeYzgjf%2BMAc%2FXMl2j%2BFxOqBxDe5k4lu6dYfCxnGc36IRzoJUhECjKPrp5R5R%2Fhktil%2F258bVURqFcWx6EGpb%2BA%3D%3D&csid=B2E547DB-E797-41A7-8F28-F24CBF6AE415"
	},
	"meal":{
		"id":34,
		"title":"一日三餐领水滴",
		"reward":"https://sns.amap.com/ws/activity/xiaode_garden/task_rewards?ent=2&in=vhwKtVaKQC7FqOAWd1YoA2Z3aXumN1msZYvdDBULzt2exPgNA6clX80WcnFrvEEPJX%2F4bMgt79HdPOrkyz4d2%2BW57UCIvr4DiP6FZ5QKptXn6yM%2BlSQFmz4jt4JhZFxU8xcXLLbh5mYMSXZBeaya6ofb48bwqaOTSJWAVV8QvPoUcjfa0%2Fvk3ruPzXOUcKZuM2aB7SJ4PzxJT7NgWsw32i3W3kgUHCvb5Zb1SObkrBBAtJpPpPNr3uZBOue9n8V2abOCAmVclp6fwnvoWweQBfuBrHKefE1BI9CeugWfNVW3WwefcCL4XZ9oxmpH2py27sFDbPDcEVk8r0u72cD%2BR3Kh8bb7W%2Fh38hFUzqHhXOnorxmWlf9Ri8bSDcNGdAVOlXgJnYjtIZArUkgtd8zgEhG4wUIaG7PG%2BheWWpbzsdDE%2FxVYX%2B5Y3Y2e02Etjvq1C7m6Q1W2s1M3Z%2BnD5QNCSqDcAThZSyGRR2IOf5G21S%2B9azCE2CLCLPQj%2BVCU6LUsRKgsuZW8pF2nqbVqmoiuFjNoEjWGkvN4U4znvqxwnO63sSUtP5ak0fSeCfmO3Akt8V3LjamZNERXfEc81BlsinH34XR%2Fe5WmFMSAhfx8QM3GBjefgVW%2FFpQZ%2Bp%2Ftx8xa5P0MFbE%2FO2zdcuWjlNkrv1yLShPsKR1eBs%2BNMYOaxJ0WhYsgaMyuDOOwUaLISfZAmnihgVvRpOJmEAURXmP3dffL3lzRX%2BM8WZCuRf6X8DNtVAZUKNS1BW8LG8yiArP5LH4bKWOXe2KumFwRHoWLeEkDYQkDWtf1ebV2HOqlGd7eD41T5hu9EzNZbE6yGI4kzMVZO293O1F5IaDHQ16wRlYRM4fjc4KkaC5FfY6ZolrkPwcwuCQ3ap66uIDcROKdNOLIynldV5V76zppzkRccHouCWD%2Bfq7Vh75Hybo1DnEkPzRNiy6wm4VAqTug0YJI5%2BfzZQhNgc9DbMkIcXQmqeidobc484c5DJVlCwZGKWRrIWccQ11gk8Sex%2FS4PyJz4WMxrvSOJRw5LSzhJbCOyPrgZFzA0WZbEipbz6pf1QI%3D&csid=B8243B32-3E6D-4E4E-8D85-BD970F86A66D"
	},
	"family":{
		"id":8,
		"title":"访问家人地图",
		"reward":"https://sns.amap.com/ws/activity/xiaode_garden/task_rewards?ent=2&in=2nA31CK8IKbnP4Ak9aTyNjVfPvK70oXP1leJwsdqE8MkDUcOKPtd7jlwo2ZebTLgOftqu7sRqmYrX3a5tgSFU%2B2ECQY13ze4JgOdG9KMNRj7FGG7lqCluN21apRZMM0a4EMuI5IpkGAoDTvhPcQXHYg3xGKwV5TE9wnLpafkzAakuSQcFgzFFyRmgFNf4WBbXgc%2BEw4max4b3AT%2B1sY5WaioyoxP12229pb44D1yvBATw7Rsafc6gHS99Akol%2B4ftjos21N27MxaH4gIvhAcz5CpvG%2FK5oxsW8rjtq6VMQp1hGwAZDvJJe7wp70t3C1vwlx1TjTjcQoA1mokHC0RUf1WzbD6XMVGT1Fql3C7pOnymgCwzufDMn880y7iHFL9nTQOurFFKY7dU199dHbqxfQ%2FCyyi9KNVwjBb6szpsf0EKKQHT8f%2F64%2FDdoeHDjB%2FEI0%2F7Q%2BpVUBo6QJ9VVfR00im8HGhOHeEyWund99afzy8wSP27EI67SR6%2B1SX%2FVMdSiwqPIMYvYK%2FBXzXr8ruh9GDRYbc2Zk9BdF3RB3rq5K43aSTkRPhiOYYYjOoOJRiFLe5zw9twzLha8XgcsHXnI3zUfdq1QTB4%2B1upvxyxepjxGT%2FYec1RVJml%2FTPltm5BpHas6O3q477nMd5YTEk1aGlMmTMSb%2BYaociCNvtPOTriPghiHtL05MQeISgcKtKdLZuotcKf2ZQ2Pxi6BeVTKyAmqFto24SSi8yENBSvZ16VnM8tsknYzlXaVaQ2NklKNI3TUDxu%2FEwYePyVgg5Q3pqaaKr64tJOwySgYEoRZ6yAxGJt2y3%2FgxbiZD56Blxi97MCsLeap3ANBQLPf4L1iK5qmdz2clvqH2SOeYddSlTwMXz%2FJqtuMXgxaxHKFRCRwz%2Btj5rDF%2F6XMUtIGLXUcQaYs3bJn%2BDHt%2B8s5k96JQFfM%2BI9wuiUgSGx9HZVwm45vSB9Q6Egt11CTWdR%2FbSUDWXMrIuBARG7f%2BS5cED9dx7%2FM%2Fz5opUUsGfx6%2FeXHwsrEzr3xJChJY95HQ8f2ZWymFLcxN72UJPx%2BkAFQNzDGU%3D&csid=B10F79FB-6F25-4CA6-987F-1837B413EF25",
		"report":{
			"url":"https://sns.amap.com/ws/oss/achievement/report?ent=2&in=xWVEsvzn47FOdCM5g20k33jIUT8DTvNN7ZYg9bd59bjqQp5b3IhWWpRSywzBAImlmugza0OzlHhInAet13IwyY5Bs1j4aAe3zLP1klrhgQsnn%2FWAIYPi0%2FLtDXwu4hX6JJ2TEamdAgkXQjWNAqn4P61vfGPL6Hx3OfhKOCdWPUX9DCiNOhF15R0hmrg8iKnsOG9AxHr%2BJquGLJdk3aEN7WlX2loraftixYjK3UGuoTtx2G1X58bEIHVI6InXMaqMwSN8mtpFbb42cij4UGymMHxW0hD9u7c0ftam0IQ4U5tqQaVBkZI5kCfBiuvtFBSHaoHtX3Qz6F6Xj687Dhx8RVXU1J2LfvbzlE3jIBZlrLPEib0tvoJqGGfYUXY8j7tQV9YNq4l4C5SbwbBVus0CtZ40%2Fv9mVB9iAb%2B3jJEzsmE%2FITxSdcQhP0FII3RyFzIbTMOv%2FTXc2%2FN04WgPw8z4fnE7DdIoCWZoMiqwtnq1x8VWYrDy5EU%2FWXrKQX6V8Hz39sbDQcKShnPWJsXxI6axrrI94nWoQWPz2pBvjKo5T1rERZ8MwyQI3LtrSYIvUit8m9zNC1hhHnK6qPRhtbqYoBD%2BkDbnmYdTLcaQlBPRTU86%2BJg4yUIOX7RZvmKKXj8tG6UJ3pD2qf4ABnCwcjKJcTtGlWWovVFzX4Qsk9e03cemE16u%2BqcpiLYaOBAwFhfgbX1DGrFZmsjMTmlKbqTJ1aBS8GDQ10nlzpV9z15Lc%2F8dK66HDxpeC07JXoOp0U3MlKG18489CxAZvWZterJvY2ulWsxMpNtQg9gq2scqspuFjtWYbtShO0xao8WA2m7WlBGv7Fhu8JlWGnzkQfHnB7cc9vuItLFubLrKVpzpqjApVNsbto8a4sWYqppLq23%2FcvavSKZ4bVIuYPJXb2t87Il4W%2BV6ozM0HKODAbVT4T3Gck%2F3fEeYIP%2FR7%2BoO%2BLmufmyozqAJP99ko1oQMhxWACOXEmq3mvyaXEi23kJJe64WWGfQ&csid=6E41268F-8404-4C1B-B141-46AA5A447BB9",
			"body":"23C8pgpu+zBl6417"
		}
	},
	"footprint":{
		"id":10,
		"title":"浏览足迹地图",
		"reward":"https://sns.amap.com/ws/activity/xiaode_garden/task_rewards?ent=2&in=fByvs2zBRRdoULCi0fWHSi97XbxITQ1IyId7rw4xmLnI0Fys03H042WzX8YIfUYfgO2cDgBVNLbDKWtxDRTCR9eykUPL%2BKp3XykQXtyO7jtuF0VyGdTwbOatJqB%2FZLXTr1A803KXjr98K%2FwXBmyWg9JkxC%2BV%2F5BsvXM0stHrtGgTaU%2FL1SGugWZGsLS2OrVivdTYnbB1eszju5SuUfOf2kQI5aRo1xXm8I9nhpbmI0XBL3xKAYyoVuPBxBhM86t22nlovrTovSg6fI3dyqMjA08CoXQrZM0MYgp14Z%2FHZAbeh4EKEz5EByjCw1J%2BbYHpJpFTBOdhKaUHPj6z8582Q4%2BYdStZdsLnrdHPAvicgAGjw5NWEauIYf7Begrh5fAtv8uNcIWmPqSogNDJlXdk85G65SVk1hxc0l34%2Bm5ddcmzbhJWzT6KqZ%2FF0%2F0KV%2BbNSM6uvwWRtjBAnwLoqSwBLqqwQcTgboWJaIGjuPnj%2FJD83aPgM3imio1odHrpZ23ccZ0GAFF0DX50%2F7ymg2JuXntBAnbW70Os9XWg0z4jCoci0BOpkb8Fmdx1ARwvoLfJLVBZpgjjV3LzzvSWh%2F6wbYbrPFaQNJbd8AM2NF2v1UdmxrlL5NCPLaoy%2Bd0Zm22mrEdfzmjQ5AfwJc0GyHMSb4ZidkEwG86m4A3pEXaD7B9RDL7kzNF0sWl61%2BFToxeK2e82qqdKJQ41MylVPei3sdyLgrK7kkeLQuW1YRCCQOqjKsnb0yiHiFKSqerJY%2FCc3oqrTqj5AoZgOvuWixd2RgFl5vC7ACgGrEICyExNWAANz%2BvywAN3W%2FOYHtfuH5aFuSbyTGNG3%2Ff8X8Qd57tHp2Vu5qLgWKiSofchu4XrHh2nzVS%2FSF2TmNDZbQRlSopAmpFqpa8aX9xn0wYscLrmKpBhl5uqoYOuooFvsgNTS47jtY%2FKkclfRKcp8d3fMIBxBr2JNZZLT72WmbgyMP6zNbvhIIsOo%2BZC7epb1hDBiIFULg3QyN2UtfpHthuKUbIVYIPDslndrrzpS0M3NbZX1QfPszprvYDCNS5CmELucs5j1Dw93z%2FHzyTOUHuOGMIH&csid=16638A79-4101-442B-A963-CE383ECC2A96",
		"report":{
			"url": "https://sns.amap.com/ws/userview/footprint/v2/detail?ent=2&in=IVcoN8kOm%2Blj%2B5i%2BJWOCl3oG83jaSzZZrYjA1%2BWNRIqNty1Wr%2FtS7xOM%2FytAs6cclJrU%2BkcayrJOHuQcEERCNy%2Bzxdr76wv7jAOQnkophIKmAEBYPuBOBDyYAPeeqr8PPVE2sZluMoTfyzTzqf2Cq6ZL7DtFOdtowPNDCc52yGE6i5xncZLNnFM0FSthdajJ8w9MwOpbW4HLXaAn93%2BAbLR1EVaIO60Pm7lfeABjjKWTFteCVc0SqHIGbniFsTbULypGBRGYGltlAZtNY4xnxgenn9Ku%2BjH4Pv3Qa51UGYA2CO8Fr5MyvSljiXjEjipyNd2sX%2BJRUsBX4J1K3NMM6wzWghs%2BBn7TkQMsea58nO0y0XaEzEVho2%2FXZa3rvSXkl6yxkjzG4dbSPWBTlJjcJ0fn%2BH3zTthJTz8a0mejg5sk7v89y%2BvWyftPzntNK9LIum8MexolkMmHr2uiX1plblpldLIcqKi1Yt5XiFZxBf9B0BOwameK20WdSjyPgA5rHGkdVp2mGxxF%2FLkOaAJuYIzOhsPrvyEqYV0JJFwcFwNbJpaLLrB4Xc1BpJCLBVM0Y%2BEGCBfBJ3WwYz9yeRTf%2BVq%2FTMoMtGkcPw22RO8dxtVUzVva%2F0%2BbwbPbE9qJPmc07JHbL0cdPoDejACTeRQLzKVGw1VtYPxetqalKgAbKdxAx7cTW%2FSTSLmFukeVDAsbI%2BwQ6%2Fnr%2F34NQPSJdkjnWwlaiNLq%2F3cwjJ9iqbcZZJARUeYGbpiXO4PiuDC78mee58B5uoRh22REs7shvt76RgxWAEQB2Sk47dX3aknIvy47D7r8tQJvqxwdydYs5CwAOmL0vGokwbIlayJQYNKCRrrzge1%2FuM8IVH6NOvw4Bt%2B4rOARuDM4GQk2psppvOXDeuqnEBkYtQTOHVES6%2F08boqOw11ODlQ9nrvlnl27qdNFoALpwBkMpB88ZIOgjUpKm7%2BxevAC%2FF9ITyrRSjIa7AbWU7dtyv5ZmI9sO2eg75M%3D&csid=AA41A3FE-F567-4A79-B6A8-027227C02DB4",
			"body": "YK2LzDJurMlMNgUcHD5Cw0ULR4ix8h7H2qqdEUsOQRBZE1/4MvVFxQcAxQdajqw6HdZoRzrFYYkHbLtkE4ZFEz/K8sWjyvrlolqsx244nP6CkSoNSethKbZZ3dqXEGThYipM3BNMuE62PIynwoNrDaLVkhqLtSbhHILknNYjDzXAg3HMA8Y+hIaAarcaTd4N1eaRtA=="
		}
	},
	"keepsign":{
		"title":"7天签到有礼",
		"reward":"https://sns.amap.com/ws/activity/xiaode_garden/sign_new?ent=2&in=9EcYi9Ka1T6QAkIt0xuBaVkR5wcYUisceQa5sj1HNyKUqvxbwXh7CoSDk%2FHNvVH2DBUIndf0JNgS%2FBSh538VpKaTZu%2Fkvo0EVIGyKLbfW%2FQQsJdnwxmr2cASzPm9wEDuD%2BYc8V7ydPGifex2E5exHTYKFPAd9iIMuJmXtMNra10n8JeNpm6e1fOptiCiSw1q2TaKmqAofKcDnhBKb6vMfBHhlkQM1fLklIfikM0H8lpKvA0c6Q1UbaQ6%2BYh%2B0v0HjzzKZpPUc6KEpA3DCKuAPkNYQRU9fS9F%2BvygIytPxXKj793GDC%2FoAdXIDrwsbx9DkLix3kiPBcyq%2Fbux6yUIJFxQ8hK7qkv%2FeTZzP6lpdHIvcDbTPLl%2Fc99opibJUBAPI38h2KqGFY39ca8WwOQYmeNMCDr%2FTxTt%2BnpfAtFLeBBfvcIxF01Dv62qgtbr1qwbiruXnzR2GELYqRnrHQmz3ymDChsCNlRvHBb2MbgIuuvQ%2BVwei3W2%2B5WU295%2F7igvZLXw6YZdQp5oOWrwosJJi8oQyVgo9w9fnEnEra0pPZ5LdEwobNH1N7ddkQE8jA4pa%2BSUDi8hP1%2BSVDMmSea8Ed8O9AfqNuGvvtrn99h6Tp2Ubgpp7rxhN3S1OK2YqIOKe1ezyfZ%2BsSy%2FJxKIZOTItMTRUiVfhNI6RqhaRw348ERZ0h5pvgQh3lef%2BiG0h8qO9VjY%2FDDmjBGTcbXY2TLlVEU8AbaI6wYGpM4ja%2F78%2BC3QiHtfolTY6jBF7aZGX4MzoA9DBhlyp2goD7AOhpWIYDl5qBykU90kIWnInIZZ2cMtqviXiNVWtKvJL8LS3inkumLjVBF6Oaau%2FyMHOyY%2Fv7HH92eyh2OGBWkThmhG8M%2F1YJALJavnDj%2BKS8WnH4rETxGp2zk%2BdNHnAbvr0EAy%2BjMd%2FNBFmiFP%2FL6fBLTApW7G6cc7WnDGE82jZnzS4P8tzES%2BYhzfcJi4P89OALKaIixnrAW4Nigp1Q9anKu8xlO0oBUC96VvZ13hEh1VlkDzkvFtqrtQ6UJFafykQ4aaCxz8J47Inqna9vc8elySSvQ%3D&csid=35DBB1B4-5845-4DEE-B717-875C966E251F",
	}
}


let waterURL = Cookies.waterURL;
let taskListURL = Cookies.taskList;
let indexURL = Cookies.index;

let taskListArr = [], leftWater, fruitInfo = {}, SignedDays, todaySignStatus, keepSignList = [], costWater, sessionID, message = '', isKeepSignStatus = 1;


//浇水
function taskWater(url) {
	return new Promise((resolve, reject) =>{
		let options = taskUrl(url)
		$.get(options, async(error, response, data) =>{
		  try {
			if (error) {
				$.log(`${JSON.stringify(error)}`)
				$.log("API请求失败，请检查网路重试")
			} else {
				if (safeGet(data)){
					data = JSON.parse(data)
					leftWater = parseInt(data.data.left_water)
					costWater = data.data.cost
					$.log(`浇水成功，剩余水滴：${leftWater}`)}
			}
		  } catch (error) {
			$.logErr(error, response)
		  } finally {
			resolve(data);
		  }
		})
	})
}

//领取奖励
function taskReward(url, title) {
	return new Promise((resolve, reject) =>{
		let options = taskUrl(url)
		 $.get(options, async(error, response, data) =>{
		  try {
			if (error) {
				$.log(`${JSON.stringify(error)}`)
				$.log("API请求失败，请检查网路重试")
			} else {
				if (safeGet(data)){
					data = JSON.parse(data)
					if (data.code == "1") {
						$.log(`${title}成功🎉，获得水滴：${JSON.stringify(data.data.rewards_list[0].amount)}`)
						$.log("等待5秒")
						await $.wait(5000)
					}else{
						$.log(`领取失败${JSON.stringify(data)}`)
						$.log("等待5秒")
						await $.wait(5000)
					}
				}
			}
		  } catch (error) {
			$.logErr(error, response)
		  } finally {
			resolve(data);
		  }
		})
	})
}

//完成任务
function taskReport(url, body) {
	return new Promise((resolve, reject) =>{
		if (!!body){
			let options = taskUrl(url, body)
			$.post(options, async(error, response, data) =>{
			 try {
			   if (error) {
				   $.log(`${JSON.stringify(error)}`)
				   $.log("POST请求失败，请稍后重试")
				   $.log("等待5秒")
					await $.wait(5000)
			   } else {
				   if (safeGet(data)){
					   data = JSON.parse(data)
					   if (data.code == "1") {
							$.log(`任务完成\n${JSON.stringify(data)}`)
							$.log("等待5秒")
							await $.wait(5000)
					   }else{
						   $.log(`任务执行失败\n${JSON.stringify(data)}`)
					   }
				   }
			   }
			 } catch (error) {
			   $.logErr(error, response)
			 } finally {
			   resolve(data);
			 }
		   })
		}else{
			let options = taskUrl(url)
			$.get(options, async(error, response, data) =>{
				try {
				  if (error) {
					  $.log(`${JSON.stringify(error)}`)
					  $.log("GET请求失败，请稍后重试")
					  $.log("等待5秒")
						await $.wait(5000)
				  } else {
					  if (safeGet(data)){
						  data = JSON.parse(data)
						  if (data.code == "1") {
							  $.log(`任务完成\n${JSON.stringify(data)}`)
							  $.log("等待5秒")
						await $.wait(5000)
						  }else{
							  $.log(`任务执行失败\n${JSON.stringify(data)}`)
						  }
					  }
				  }
				} catch (error) {
				  $.logErr(error, response)
				} finally {
				  resolve(data);
				}
			  })
		}
	})
}


//任务列表
function taskList(url) {
	return new Promise((resolve, reject) =>{
		let options = taskUrl(url)
		$.get(options, async(error, response, data) =>{
		  try {
			if (error) {
				$.log(`${JSON.stringify(error)}`)
				$.log("请求失败，请稍后重试")
			} else {
				if (safeGet(data)){
					data = JSON.parse(data)
					if (data.code == "1") {
						taskListArr = data.data.task_list
						taskTotal = data.data.task_bar.total
						taskFinish = data.data.task_bar.finish
						taskBarArr = data.data.task_bar.steps
					}else{
						$.log(`访问错误：${JSON.stringify(data)}`)
					}
				}
			}
		  } catch (error) {
			$.logErr(error, response)
		  } finally {
			resolve(data);
		  }
		})
	})
}

//主页-剩余水滴数
function gameIndex(url) {
	return new Promise((resolve, reject) =>{
		let options = taskUrl(url)
		$.get(options, async(error, response, data) =>{
		  try {
			if (error) {
				$.log(`${JSON.stringify(error)}`)
				$.log("请求失败，请稍后重试")
			} else {
				if (safeGet(data)){
					data = JSON.parse(data)
					if (data.code == "1") {
						leftWater = data.data.left_water
						fruitInfo = data.data.fruit_info
					}else{
						$.log(`访问错误：${JSON.stringify(data)}`)
					}
				}
			}
		  } catch (error) {
			$.logErr(error, response)
		  } finally {
			resolve(data);
		  }
		})
	})
}

//连续签到状态
function keepSign(url) {
	return new Promise((resolve, reject) =>{
		let options = taskUrl(url)
		$.get(options, async(error, response, data) =>{
		  try {
			if (error) {
				$.log(`${JSON.stringify(error)}`)
				$.log("请求失败，请稍后重试")
			} else {
				if (safeGet(data)){
					data = JSON.parse(data)
					if (data.code == "1") {
						todaySignStatus = data.data.sign_today
						keepSignList = data.data.list
						for (let i = 0; i < keepSignList.length; i++) {
							if (keepSignList[i].is_today == 1) {
								isKeepSignStatus = 1
								break
							}else{
								isKeepSignStatus = 0
							};
						}
					}else{
						$.log(`访问错误：${JSON.stringify(data)}`)
					}
				}
			}
		  } catch (error) {
			$.logErr(error, response)
		  } finally {
			resolve(data);
		  }
		})
	})
}

//领取7日连续签到奖励
function keepSignReward(url, title) {
	return new Promise((resolve, reject) =>{
		let options = taskUrl(url)
		 $.get(options, async(error, response, data) =>{
		  try {
			if (error) {
				$.log(`${JSON.stringify(error)}`)
				$.log("请求失败，请稍后重试")
			} else {
				if (safeGet(data)){
					data = JSON.parse(data)
					if (data.code == "1") {
						$.log(`${title}成功🎉，获得水滴：${JSON.stringify(data.data.amount)}`)
						$.log("等待5秒")
						await $.wait(5000)
					}else{
						$.log(`领取失败${JSON.stringify(data)}`)
						$.log("等待5秒")
						await $.wait(5000)
					}
				}
			}
		  } catch (error) {
			$.logErr(error, response)
		  } finally {
			resolve(data);
		  }
		})
	})
}

function checkTaskId(TaskId){
	for (let i = 0; i < taskListArr.length; i++){
		if (taskListArr[i].id == TaskId){
			return i
		}else{
			continue
		}
	}
	$.log(`\n任务ID${TaskId}不存在`)
	return null
}

async function totalInfo(){
	await gameIndex(indexURL)
	await taskList(taskListURL)
	await keepSign(Cookies.signListURL)
	$.msg($.name, message, ``);
}

//taskListArr[i].status这个参数表明了任务状态，0为未完成/未领取，1为已完成待领取，2为已完成/已结束
async function doTask(){
	//一日三餐-通用
	if (checkTaskId(34) != null) {
		$.log("\n【一日三餐领水滴任务】")
		TaskIndex = await checkTaskId(34)
		if (TaskIndex !== null) {
			if (Cookies.meal.reward) {
				mealTime = taskListArr[TaskIndex].next_time.slice(0,2)
				nowHours = parseInt(new Date().getHours())
				if (taskListArr[TaskIndex].status == 1 && nowHours >= mealTime) {
					await taskReward(Cookies.meal.reward, Cookies.meal.title)
				}else if(taskListArr[TaskIndex].next_time == false){
					$.log("今日一日三餐打卡已结束，跳过")
				}else{
					$.log(`打卡时间已过或未到，下次打卡时间为：${taskListArr[TaskIndex].next_time}`)
				}
			}else{
				$.log("任务Cookie数据缺失，跳过")
			}
		}else{
			$.log("\n【一日三餐领水滴任务】\n未找到任务，可能已失效")
		}
	}

	//日常签到-通用
	if (await checkTaskId(31) != null) {
		$.log("\n【日常签到任务】")
		TaskIndex = await checkTaskId(31)
		if (TaskIndex !== null) {
			if (Cookies.sign.reward) {
				if (taskListArr[TaskIndex].finish_times <= 1 && taskListArr[TaskIndex].status == 1) {
					await taskReward(Cookies.sign.reward, Cookies.sign.title)
				}else{
					$.log("已完成✅，跳过")
				}
			}else{
				$.log("任务Cookie数据缺失，跳过")
			}
		}else{
			$.log("\n【日常签到任务】\n未找到任务，可能已失效")
		}
	}

	//家人地图-通用
	if (await checkTaskId(8) != null && Cookies.family.report.url) {
		$.log("\n【浏览家人地图任务】")
		TaskIndex = await checkTaskId(8)
		if (TaskIndex !== null) {
			if (Cookies.family.report.url && Cookies.family.report.body && Cookies.family.reward) {
				if (taskListArr[TaskIndex].status == 0) {
					await taskReport(Cookies.family.report.url, Cookies.family.report.body)
					await taskReward(Cookies.family.reward, Cookies.family.title)
				}else if(taskListArr[TaskIndex].status == 1) {
					await taskReward(Cookies.family.reward, Cookies.family.title)
				}else if(taskListArr[TaskIndex].status == 2){
					$.log("已完成✅，跳过")
				}
			}else{
				$.log("任务Cookie数据缺失，跳过")
			}
		}else{
			$.log("\n【浏览家人地图任务】\n未找到任务，可能已失效")
		}
	}

	//足迹地图
	if (await checkTaskId(10) != null && Cookies.footprint.report.url) {
		$.log("\n【浏览足迹地图任务】")
		TaskIndex = await checkTaskId(10)
		if (TaskIndex !== null) {
			if (Cookies.footprint.report.url && Cookies.footprint.report.body && Cookies.footprint.reward) {
				if (taskListArr[TaskIndex].status == 0) {
					await taskReport(Cookies.footprint.report.url, Cookies.footprint.report.body)
					await taskReward(Cookies.footprint.reward, Cookies.footprint.title)
				}else if(taskListArr[TaskIndex].status == 1) {
					await taskReward(Cookies.footprint.reward, Cookies.footprint.title)
				}else if(taskListArr[TaskIndex].status == 2){
					$.log("已完成✅，跳过")
				}
			}else{
				$.log("任务Cookie数据缺失，跳过")
			}
		}else{
			$.log("\n【浏览足迹地图任务】\n未找到任务，可能已失效")
		}
	}

	//7天签到
	if (todaySignStatus == 0 && isKeepSignStatus == 1) {
		$.log("\n【连续签到任务】")
		await keepSignReward(Cookies.keepsign.reward, Cookies.keepsign.title)
	}else if(todaySignStatus == 1){
		$.log("\n【连续签到任务】\n已完成✅，跳过")
	}

	//浇水得水滴（需要判断任务完成状态并执行浇水）-通用
	if (await checkTaskId(33) != null) {
		$.log("\n【开始浇水领水滴任务】")
		TaskIndex = await checkTaskId(33)
		if (TaskIndex !== null) {
			if (Cookies.waterBonus.reward) {
				if (taskListArr[TaskIndex].status == 1) {
					$.log("\n任务已完成，领取浇水领水滴")
					await taskReward(Cookies.waterBonus.reward, Cookies.waterBonus.title)
				}else if(taskListArr[TaskIndex].status == 0){
					needWaterTimes = taskListArr[TaskIndex].repeat_times - taskListArr[TaskIndex].finish_times
					$.log(`需要浇水${needWaterTimes}次`)
					for (let i = 0; i < needWaterTimes; i++) {
						$.log(`第${i+1}次浇水`)
						await taskWater(waterURL);
						if (leftWater <= 10) {
							$.log("剩余水滴不足，浇水结束")
							taskWaterBonusFinish = 0
							break
						}
						taskWaterBonusFinish = 1
					}
					if (taskWaterBonusFinish !== 0) {
						await taskReward(Cookies.waterBonus.reward, Cookies.waterBonus.title)
					}else{
						$.log("任务未完成，跳过")
					}
				}else if(taskListArr[TaskIndex].status == 2){
					$.log("已完成✅，跳过")
				}
			}else{
				$.log("任务Cookie数据缺失，跳过")
			}
		}else{
			$.log("未找到任务，可能已失效")
		}
	}

	//额外任务水滴-通用
	if (Cookies.taskBonusWater_30) {
		if (taskBarArr[0].status == 1) {
			$.log("\n【领取额外任务水滴30g】")
			await taskReward(Cookies.taskBonusWater_30, "领取额外任务水滴30g")
		}else if (taskBarArr[0].status == 2) {
			$.log("\n【领取额外任务水滴30g】\n已完成领取额外任务水滴30g任务，跳过")
		}else if(taskBarArr[0].status == 0){
			$.log("\n【领取额外任务水滴30g】\n已完成任务数不足，未达到领取条件，继续做任务吧")
		}
	}else{
		$.log("\n【领取额外任务水滴30g】\n任务Cookie数据缺失，跳过")
	}

	if (Cookies.taskBonusWater_70) {
		if (taskBarArr[1].status == 1) {
			$.log("\n【领取额外任务水滴70g】")
			await taskReward(Cookies.taskBonusWater_70, "领取额外任务水滴70g")
		}else if (taskBarArr[1].status == 2) {
			$.log("\n【领取额外任务水滴70g】\n已完成领取额外任务水滴70g任务，跳过")
		}else if(taskBarArr[1].status == 0){
			$.log("\n【领取额外任务水滴70g】\n已完成任务数不足，未达到领取条件，继续做任务吧")
		}
	}else{
		$.log("\n【领取额外任务水滴70g】\n任务Cookie数据缺失，跳过")
	}

}

function Getck() {
	if ($request.headers['sessionid']) {
		const sessionID = $request.headers['sessionid']
		if (sessionIdArr.indexOf(sessionID) > -1) {
			$.msg('此账号Cookie数据已存在')
		}else{
			sessionIdArr.push(sessionID)
			$.setjson(sessionIdArr, "gddtSessionId")
			$.log(`获取小徳果园Cookie成功 🎉 【 gddtSessionId 】: ${sessionID}`);
			$.msg($.name,`获取小徳果园Cookie成功 🎉 `, ``);
		}
	}
}

function taskUrl(url, body = null){
	if (body != null) {
		return {
			url: `${url}`,
			headers: {
				"Host": "sns.amap.com",
				"x-pv": "6.3",
				"X-Requested-With": "XMLHttpRequest",
				"User-Agent": "iphone OS 14.6",
				"Proxy-Connection": "close",
				"x-bx-version": "6.5.13803238",
				"Cookie": `sessionid=${sessionID}`,
				"Content-Length": "16",
				"Connection": "close",
				"sessionid": sessionID,
				"Accept": "application/json",
				"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
				"Accept-Encoding": "gzip",
				"x-t": parseInt(new Date().getTime() / 1000)
			},
			body: body
		}
	}else{
		return {
			url: `${url}`,
			headers: {
				"Host": "sns.amap.com",
				"Proxy-Connection": "keep-alive",
				"x-t": parseInt(new Date().getTime() / 1000),
				"x-pv": "6.3",
				"Accept-Encoding": "gzip",
				"sessionid": sessionID,
				"User-Agent": "iphone OS 14.6",
				"Connection": "keep-alive",
				"Content-Type": "application/x-www-form-urlencoded",
				"Cookie": `sessionid=${sessionID}`,
				"x-bx-version": "6.5.13803238"
			}
		}
	}
}

function safeGet(data) {
	try {
	  if (typeof JSON.parse(data) == "object") {
		return true;
	  }
	} catch (e) {
	  $.log(e);
	  $.log(`服务器数据异常，请检查网络情况`);
	  return false;
	}
}

if ($.isNode()) {
	if (sessionIdArr.length <= 0) {
		if (process.env.GDDT_SESSIONID && process.env.GDDT_SESSIONID.indexOf('&')) {
			sessionIdArr = process.env.GDDT_SESSIONID.split('&')
		}else if (process.env.GDDT_SESSIONID) {
			sessionIdArr = process.env.GDDT_SESSIONID.split()
		}else{
			$.log("没有Cookie数据，请将Cookie数据设置为GDDT_SESSIONID环境变量，退出！")
			exit(1)
		}
	}
}

!(async () => {
  if (typeof $request !== "undefined") {
	Getck();
	$.done();
  } else {
	if (sessionIdArr.length == 0){
		console.log(`脚本执行时间：${$.time('yyyy-MM-dd HH:mm:ss')}\n`)
		$.log("请先获取高德果园Cookie")
	}else{
		$.log(`脚本执行时间：${$.time('yyyy-MM-dd HH:mm:ss')}`)
		$.log(`共有${sessionIdArr.length}个账号数据`)
		for (let j = 0; j < sessionIdArr.length; j++) {
			sessionID = sessionIdArr[j];
			message += `\n【账号${j+1}】`
			$.log(`\n==============账号${j+1}===============`)
			$.log("\n<水果信息>")
			await gameIndex(indexURL)
			$.log(`剩余水滴：${leftWater}\n当前阶段：${fruitInfo.step}\n当前进度：${fruitInfo.finish}%`)
			$.log("\n<任务信息>")
			await taskList(taskListURL)
			$.log(`获取任务列表成功\n总共${taskListArr.length}个任务，已完成${taskFinish}个任务`)
			await keepSign(Cookies.signListURL)
			await doTask()
			await gameIndex(indexURL)
			if (leftWater >= 10) {
				$.log("\n【开始执行浇水】")
				for (let i = 1; i <= 30; i++) {
					$.log(`第${i}次浇水`)
					await taskWater(waterURL);
					if (leftWater <= 20) {
						$.log("剩余水滴不足30，浇水结束")
						break
					}
					$.log("等待8秒")
					await $.wait(8000)
				}
			}else{
				$.log("\n【开始执行浇水】\n剩余水滴数不足，跳过浇水")
			}
			message += `\n剩余水滴：${leftWater}\n当前阶段：${fruitInfo.step}\n当前进度：${fruitInfo.finish}%\n今日任务：${taskFinish}/${taskListArr.length}\n`
		}
		await totalInfo()
	}
  }})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())



// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:i,...r}=t;this.got[s](i,r).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
