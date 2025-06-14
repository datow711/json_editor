import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";

export default function JsonEditorApp() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = JSON.parse(event.target.result);
      setData(json);
      setCurrentIndex(0);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
  if (!data || data.length === 0) {
    alert("目前沒有資料可以下載！");
    return;
  }
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "台語名人堂資料.json";
    a.target = "_blank";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("JSON 轉換失敗：", error);
    alert("下載失敗，請稍後再試。錯誤訊息：" + error.message);
  }
};

  const updateCurrent = (fieldPath, value) => {
    const updated = [...data];
    const keys = fieldPath.split(".");
    let target = updated[currentIndex];
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
    setData(updated);
  };

  const updateListField = (fieldPath, index, value) => {
    const updated = [...data];
    const keys = fieldPath.split(".");
    let target = updated[currentIndex];
    for (let i = 0; i < keys.length; i++) {
      target = target[keys[i]];
    }
    target[index] = value;
    setData(updated);
  };

  const addToListField = (fieldPath) => {
    const updated = [...data];
    const keys = fieldPath.split(".");
    let target = updated[currentIndex];
    for (let i = 0; i < keys.length; i++) {
      target = target[keys[i]];
    }
    target.push("");
    setData(updated);
  };

  const removeFromListField = (fieldPath, index) => {
    const updated = [...data];
    const keys = fieldPath.split(".");
    let target = updated[currentIndex];
    for (let i = 0; i < keys.length; i++) {
      target = target[keys[i]];
    }
    target.splice(index, 1);
    setData(updated);
  };

  if (data.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <Input type="file" accept=".json" onChange={handleFileUpload} />
      </div>
    );
  }

  const current = data[currentIndex];
  const basic = current.basicInfo;

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r flex flex-col p-2 max-h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-150px)]">
          <div className="flex flex-col w-full overflow-y-auto max-h-[calc(100vh-150px)]">
  {data.map((item, idx) => (
    <button
      key={idx}
      className={`text-left px-2 py-1 rounded w-full text-sm hover:bg-muted/50 ${idx === currentIndex ? "bg-muted" : ""}`}
      onClick={() => setCurrentIndex(idx)}
    >
      {item.basicInfo.name || `作家 ${idx + 1}`}
    </button>
  ))}
</div>
        </div>
        <div className="mt-4 space-y-2">
          <Button onClick={() => setData([...data, {
            basicInfo: { name: "", pron_tl: "", pron_poj: "", born: "", dead: "", intro: "", highlights: ["", "", ""], photo: "", illustration: "" },
            experience: [], works_categories: [], works_items: {}, resources: [], metaverse: [], awards: []
          }])} className="w-full btn-black">新增作家</Button>
          <Button onClick={handleDownload} className="w-full btn-black" variant="secondary">
            <Download className="w-4 h-4 mr-1" /> 下載 JSON
          </Button>
        </div>
      </div>

      <div className="w-3/4 p-4 overflow-y-auto max-h-screen space-y-4">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <label className="text-sm font-semibold">基本資料</label>
            <Input value={basic.name} onChange={(e) => updateCurrent("basicInfo.name", e.target.value)} placeholder="姓名" />
            <Input value={basic.pron_tl} onChange={(e) => updateCurrent("basicInfo.pron_tl", e.target.value)} placeholder="台羅拼音" />
            <Input value={basic.pron_poj} onChange={(e) => updateCurrent("basicInfo.pron_poj", e.target.value)} placeholder="白話字拼音" />
            <Input value={basic.born} onChange={(e) => updateCurrent("basicInfo.born", e.target.value)} placeholder="出生年" />
            <Input value={basic.dead} onChange={(e) => updateCurrent("basicInfo.dead", e.target.value)} placeholder="離世年" />
            <Textarea value={basic.intro} onChange={(e) => updateCurrent("basicInfo.intro", e.target.value)} placeholder="簡介" />
          <label className="text-sm font-semibold">簡介重點</label>
{(basic.highlights || []).map((h, i) => (
  <div key={i} className="flex gap-2 items-center">
    <Input value={h} onChange={(e) => updateListField("basicInfo.highlights", i, e.target.value)} placeholder="重點項目" />
    <Button className = "btn-black" size="sm" onClick={() => removeFromListField("basicInfo.highlights", i)}>刪</Button>
  </div>
))}
<Button size="sm" className="btn-black" onClick={() => addToListField("basicInfo.highlights")}>新增重點</Button><div className="h-4" />

<label className="text-sm font-semibold">經歷</label>
{(current.experience || []).map((e, i) => (
  <div key={i} className="flex gap-2 items-center">
    <Input value={e} onChange={(ev) => updateListField("experience", i, ev.target.value)} placeholder="經歷項目" />
    <Button size="sm" className="btn-black" onClick={() => removeFromListField("experience", i)}>刪</Button>
  </div>
))}
<Button size="sm" className="btn-black" onClick={() => addToListField("experience")}>新增經歷</Button><div className="h-4" />

<label className="text-sm font-semibold">元宇宙資源</label>
{(current.metaverse || []).map((e, i) => (
  <div key={i} className="flex gap-2 items-center">
    <Input value={e} onChange={(ev) => updateListField("metaverse", i, ev.target.value)} placeholder="資源連結" />
    <Button size="sm" className="btn-black" onClick={() => removeFromListField("metaverse", i)}>刪</Button>
  </div>
))}
<Button size="sm" className="btn-black" onClick={() => addToListField("metaverse")}>新增元宇宙</Button><div className="h-4" />

<label className="text-sm font-semibold">獲獎記錄</label>
{(current.awards || []).map((e, i) => (
  <div key={i} className="flex gap-2 items-center">
    <Input value={e} onChange={(ev) => updateListField("awards", i, ev.target.value)} placeholder="獎項" />
    <Button size="sm" className="btn-black" onClick={() => removeFromListField("awards", i)}>刪</Button>
  </div>
))}
<Button size="sm" className="btn-black" onClick={() => addToListField("awards")}>新增獎項</Button><div className="h-4" />

<label className="text-sm font-semibold">外部資源</label>
{(current.resources || []).map((res, i) => (
  <div key={i} className="space-y-1 border p-2 rounded">
    <Input value={res.title} onChange={(e) => {
      const updated = [...data];
      updated[currentIndex].resources[i].title = e.target.value;
      setData(updated);
    }} placeholder="標題" />
    <Input value={res.description} onChange={(e) => {
      const updated = [...data];
      updated[currentIndex].resources[i].description = e.target.value;
      setData(updated);
    }} placeholder="說明" />
    <Input value={res.img} onChange={(e) => {
      const updated = [...data];
      updated[currentIndex].resources[i].img = e.target.value;
      setData(updated);
    }} placeholder="圖片網址" />
    <Input value={res.url} onChange={(e) => {
      const updated = [...data];
      updated[currentIndex].resources[i].url = e.target.value;
      setData(updated);
    }} placeholder="連結網址" />
    <Button size="sm" className="btn-black" onClick={() => {
      const updated = [...data];
      updated[currentIndex].resources.splice(i, 1);
      setData(updated);
    }}>刪除</Button>
  </div>
))}
<Button size="sm" className="btn-black" onClick={() => {
  const updated = [...data];
  updated[currentIndex].resources.push({ title: "", description: "", img: "", url: "" });
  setData(updated);
}}>新增資源</Button><div className="h-4" />
<label className="text-sm font-semibold">作品項目</label>
{Object.entries(current.works_items || {}).map(([category, items], catIndex) => (
  <div key={catIndex} className="border p-2 rounded space-y-2">
    <div className="flex gap-2 items-center">
      <Input
        value={category}
        onChange={(e) => {
          const updated = [...data];
          const entries = Object.entries(updated[currentIndex].works_items);
          const newKey = e.target.value;
          const value = entries[catIndex][1];
          entries.splice(catIndex, 1);
          entries.splice(catIndex, 0, [newKey, value]);
          updated[currentIndex].works_items = Object.fromEntries(entries);
          setData(updated);
        }}
        placeholder="分類名稱"
      />
      <Button size="sm" className="btn-black" onClick={() => {
        const updated = [...data];
        delete updated[currentIndex].works_items[category];
        setData(updated);
      }}>刪除此分類</Button>
    </div>
    {(items || []).map((item, idx) => (
      <div key={idx} className="space-y-1 border p-2 rounded">
        {typeof item === "string" ? (
          <div className="flex gap-2 items-center">
            <Input
              value={item}
              onChange={(e) => {
                const updated = [...data];
                updated[currentIndex].works_items[category][idx] = e.target.value;
                setData(updated);
              }}
              placeholder="作品名稱"
            />
            <Button size="sm" className="btn-black" onClick={() => {
              const updated = [...data];
              updated[currentIndex].works_items[category].splice(idx, 1);
              setData(updated);
            }}>刪</Button>
          </div>
        ) : (Array.isArray(item.items) && typeof item.series === "string" ? (
          <div className="space-y-1">
            <div className="flex gap-2 items-center">
              <Input
                value={item.series}
                onChange={(e) => {
                  const updated = [...data];
                  updated[currentIndex].works_items[category][idx].series = e.target.value;
                  setData(updated);
                }}
                placeholder="系列名稱"
              />
              <Button size="sm" className="btn-black" onClick={() => {
                const updated = [...data];
                updated[currentIndex].works_items[category].splice(idx, 1);
                setData(updated);
              }}>刪除系列</Button>
            </div>
            {(item.items || []).map((sub, si) => (
              <div key={si} className="flex gap-2 items-center pl-4">
                <Input
                  value={sub}
                  onChange={(e) => {
                    const updated = [...data];
                    updated[currentIndex].works_items[category][idx].items[si] = e.target.value;
                    setData(updated);
                  }}
                  placeholder="子作品"
                />
                <Button size="sm" className="btn-black" onClick={() => {
                  const updated = [...data];
                  updated[currentIndex].works_items[category][idx].items.splice(si, 1);
                  setData(updated);
                }}>刪</Button>
              </div>
            ))}
            <Button size="sm" className="btn-black" onClick={() => {
              const updated = [...data];
              updated[currentIndex].works_items[category][idx].items.push("");
              setData(updated);
            }}>新增子作品</Button>
          </div>
        ) : null)}
      </div>
    ))}
    <div className="flex gap-2">
      <Button size="sm" className="btn-black" onClick={() => {
        const updated = [...data];
        updated[currentIndex].works_items[category].push("");
        setData(updated);
      }}>新增單作</Button>
      <Button size="sm" className="btn-black" onClick={() => {
        const updated = [...data];
        updated[currentIndex].works_items[category].push({ series: "", items: [""] });
        setData(updated);
      }}>新增系列</Button>
    </div>
  </div>
))}
<Button size="sm" className="btn-black" onClick={() => {
  const updated = [...data];
  updated[currentIndex].works_items["新分類"] = [];
  setData(updated);
}}>新增分類</Button>
<div className="h-4" />
</CardContent></Card>
</div></div>
  );
}
