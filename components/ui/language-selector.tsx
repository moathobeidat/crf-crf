"use client";

import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Language {
  code: string;
  name: string;
  flag?: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  currentLanguage: string;
  variant?: "icon" | "text" | "both" | "flag";
  className?: string;
}

export function LanguageSelector({
  languages,
  currentLanguage,
  variant = "both",
  className = "",
}: LanguageSelectorProps) {
  const [selected, setSelected] = useState(currentLanguage);

  const currentLang = languages.find((lang) => lang.code === selected) || languages[0];

  const handleSelect = (code: string) => {
    setSelected(code);
    // Here you would typically handle language change in your app
  };

  const renderTrigger = () => {
    if (variant === "icon") {
      return <Globe className="h-5 w-5" />;
    }

    if (variant === "text") {
      return (
        <div className="flex items-center">
          <span>{currentLang.name}</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </div>
      );
    }

    if (variant === "flag" && currentLang.flag) {
      return (
        <div className="flex items-center">
          <span className="mr-1">{currentLang.flag}</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <Globe className="h-5 w-5 mr-2" />
        <span>{currentLang.name}</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex items-center ${className}`}>
        {renderTrigger()}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((language) => (
          <DropdownMenuItem key={language.code} onClick={() => handleSelect(language.code)}>
            {language.flag && <span className="mr-2">{language.flag}</span>}
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
