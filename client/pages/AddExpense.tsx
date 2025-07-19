import { useState } from "react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGroup } from "@/components/GroupContext";
import { useExpense } from "@/components/ExpenseContext";
import { toast } from "@/hooks/use-toast";

const categories = [
  { value: "entertainment", label: "Entertainment", emoji: "🎬" },
  { value: "food", label: "Food", emoji: "🍔" },
  { value: "grocery", label: "Grocery", emoji: "🛒" },
  { value: "health", label: "Health", emoji: "🏥" },
  { value: "home", label: "Home Essentials", emoji: "🏠" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "transport", label: "Transport", emoji: "🚗" },
  { value: "others", label: "Others", emoji: "📦" },
];

const members = [
  { value: "tejas", label: "Tejas" },
  { value: "priyanka", label: "Priyanka" },
  { value: "abhishek", label: "Abhishek" },
];

export default function AddExpense() {
  const navigate = useNavigate();
  const { activeGroup, getActiveGroupName } = useGroup();
  const { addExpense } = useExpense();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "personal",
    paidBy: "tejas",
    comment: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  const currentGroupName = getActiveGroupName();

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      entertainment: "🎬",
      food: "🍔",
      grocery: "🛒",
      health: "🏥",
      home: "🏠",
      shopping: "🛍️",
      travel: "✈️",
      transport: "🚗",
      others: "📦",
    };
    return emojiMap[category] || "📦";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and category",
        variant: "destructive",
      });
      return;
    }

    const expenseType =
      formData.type === "personal" ? "Personal" : currentGroupName;

    addExpense({
      category:
        categories.find((c) => c.value === formData.category)?.label ||
        formData.category,
      amount: parseFloat(formData.amount),
      paidBy:
        members.find((m) => m.value === formData.paidBy)?.label || "Tejas",
      comment: formData.comment,
      date: formData.date,
      time: formData.time,
      type: expenseType,
      emoji: getCategoryEmoji(formData.category),
      groupId: activeGroup,
    });

    toast({
      title: "Expense Added",
      description: `₹${formData.amount} expense added successfully`,
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Add Expense</h1>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="expense-card p-6 space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (₹) *
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="150"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="text-lg h-12"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              required
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expense Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Expense Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal">Personal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group">{currentGroupName}</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Paid By</Label>
            <Select
              value={formData.paidBy}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, paidBy: value }))
              }
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Tejas (You)" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.value} value={member.value}>
                    {member.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">
              Comment (Optional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Biscuits"
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date & Time</Label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="h-12 pr-12 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5"
                />
                <Calendar
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 pointer-events-none"
                />
              </div>
              <div className="flex-1 relative">
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="h-12 pr-12 [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <Clock
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 pointer-events-none"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Track when the expense occurred
            </p>
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            className="w-full h-12 gradient-button rounded-xl text-base font-semibold"
          >
            Save Expense
          </Button>
        </form>
      </div>

      <BottomNavigation />
    </div>
  );
}
