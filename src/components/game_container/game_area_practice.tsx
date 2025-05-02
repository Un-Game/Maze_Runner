import React, { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import BackButton from "../_components/back_button";
import { useKeyBind } from "@/context/KeybindContext";

type props = {
  setMenuState: React.Dispatch<React.SetStateAction<string>>;
  menuState: string;
};

const { Engine, Runner, Bodies, Body, Composite, Events } = Matter;

const config = {
  containerWidth: 1500,
  containerHeight: 900,
  wallThickness: 50,
  ballRadius: 5,
  moveForce: 0.001,
  maxSpeed: 5,
  playerOptions: {
    mass: 1,
    restitution: 0,
    friction: 0.1,
    frictionAir: 0.02,
  },
  inputKeys: {
    skill1: "c",
    skill2: "f",
    skill3: "t",
  }
};

const playerSetting = {
  skills: {
    skill1: {
      name: "Skill 1",
      description: "Skill 1 description",
      effectDuration: 2000,
      cooldown: 2000,
      isInCooldown: false,
      startedAt: 0,
    },
    skill2: {
      name: "Skill 2",
      description: "Skill 2 description",
      cooldown: 2000,
      usedState: false,
      markedCoordinate: { x: 0, y: 0 },
      isInCooldown: false,
      startedAt: 0,
    },
    skill3: {
      name: "Skill 3",
      description: "Skill 3 description",
      cooldown: 2000,
      isInCooldown: false,
      startedAt: 0,
    }
  },
  effects: {
    activeSkills: [],
    inCooldownSkills: []
  }
}


const currMap = {
  maze: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 2],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],
  spawnPoint: { x: 10, y: 10 },
  exitPoint: { x: 100, y: 100 },
}

const maze = currMap.maze

export default function GameAreaPracticeMatter(props:props) {
  const {keybinds} = useKeyBind()
  const {setMenuState, menuState} = props

  const [renderPosition, setRenderPosition] = useState({
    x: config.containerWidth / 2,
    y: config.containerHeight / 2,
  });
  const [renderEnemy, setRenderEnemy] = useState({
    x: 0,
    y: 0,
  });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());
  const runnerRef = useRef(Runner.create());
  const playerBodyRef = useRef<Matter.Body | null>(null);
  const player2BodyRef = useRef<Matter.Body | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const cellSize = 17

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase(); 
    console.log(`Key down: ${key}`); 
    keysPressed.current[key] = true;
  };
  
  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase(); 
    console.log(`Key up: ${key}`); 
    keysPressed.current[key] = false;
  };

  useEffect(() => {
    const engine = engineRef.current;
    const runner = runnerRef.current;

    engine.gravity.y = 0;

    const walls = [

      Bodies.rectangle(
        config.containerWidth / 2,
        -config.wallThickness / 2,
        config.containerWidth + 2 * config.wallThickness,
        config.wallThickness,
        { isStatic: true }
      ),

      Bodies.rectangle(
        config.containerWidth / 2,
        config.containerHeight + config.wallThickness / 2,
        config.containerWidth + 2 * config.wallThickness,
        config.wallThickness,
        { isStatic: true }
      ),

      Bodies.rectangle(
        -config.wallThickness / 2,
        config.containerHeight / 2,
        config.wallThickness,
        config.containerHeight + 2 * config.wallThickness,
        { isStatic: true }
      ),

      Bodies.rectangle(
        config.containerWidth + config.wallThickness / 2,
        config.containerHeight / 2,
        config.wallThickness,
        config.containerHeight + 2 * config.wallThickness,
        { isStatic: true }
      ),
    ];

    const mazeBody = [];
    const finishPoint = [];

    for (let row = 0; row < maze.length; row++) {
      for (let col = 0; col < maze[row].length; col++) {
        if (maze[row][col] === 1) {
          const wall = Bodies.rectangle(
            col * cellSize + cellSize / 2,
            row * cellSize + cellSize / 2,
            cellSize,
            cellSize,
            { isStatic: true }
          );
          mazeBody.push(wall);
        }
        if (maze[row][col] === 2) {
          const finish = Bodies.rectangle(
            col * cellSize + cellSize / 2,
            row * cellSize + cellSize / 2,
            cellSize,
            cellSize,
            { isStatic: true, isSensor: true }
          );
          finishPoint.push(finish);
        }
      }
    }

    Composite.add(engine.world, walls);
    Composite.add(engine.world, mazeBody);
    Composite.add(engine.world, finishPoint);




    const initialX = 20;
    const initialY = 20;
    const player = Bodies.circle(
      initialX,
      initialY,
      config.ballRadius,
      config.playerOptions
    );
    playerBodyRef.current = player;
    Composite.add(engine.world, player);

    const player2 = Bodies.circle(
      20,
      50,
      config.ballRadius,
      config.playerOptions
    );
    player2BodyRef.current = player2
    Composite.add(engine.world, player2);

    
    const updateCallback = () => {
      
      const playerBody = playerBodyRef.current;
      const player2Body = player2BodyRef.current;
      if (!playerBody || !player2Body) return;

      setRenderEnemy({ x: player2Body.position.x, y: player2Body.position.y });


      let forceX = 0;
      let forceY = 0;
      if (keysPressed.current[keybinds.up]) forceY -= config.moveForce;
      if (keysPressed.current[keybinds.down]) forceY += config.moveForce;
      if (keysPressed.current[keybinds.left]) forceX -= config.moveForce;
      if (keysPressed.current[keybinds.right]) forceX += config.moveForce;

      if (keysPressed.current[keybinds.skillOne] && !playerSetting.skills.skill1.isInCooldown) {
        playerSetting.skills.skill1.isInCooldown = true;
        config.maxSpeed = 7.5;

        setTimeout(() => {
          config.maxSpeed = 5;
        }, playerSetting.skills.skill1.effectDuration);

        setTimeout(() => {
          playerSetting.skills.skill1.isInCooldown = false;
        }, playerSetting.skills.skill1.cooldown);
      };

      if( keysPressed.current[keybinds.skillTwo] && !playerSetting.skills.skill2.isInCooldown) {

        if( playerSetting.skills.skill2.usedState) {

          
          playerSetting.skills.skill2.isInCooldown = true;
          playerSetting.skills.skill2.usedState = false;
          
          Matter.Body.setPosition(playerBody, {
            x: playerSetting.skills.skill2.markedCoordinate.x,
            y: playerSetting.skills.skill2.markedCoordinate.y,
          });
          
          setTimeout(() => {
            playerSetting.skills.skill2.isInCooldown = false;
          }, playerSetting.skills.skill2.cooldown);
        } else {
          playerSetting.skills.skill2.markedCoordinate = {x: playerBody.position.x, y: playerBody.position.y};
          setTimeout(() => {
            playerSetting.skills.skill2.usedState = true;
          }, 500 );
        }
      }

      if( keysPressed.current[keybinds.skillThree] && !playerSetting.skills.skill3.isInCooldown) {
        playerSetting.skills.skill3.isInCooldown = true;
        Matter.Body.set(playerBody, {isSensor: true});
        setTimeout(() => {
          playerSetting.skills.skill3.isInCooldown = false;
        }, playerSetting.skills.skill3.cooldown);
        setTimeout(()=> {
          Matter.Body.set(playerBody, {isSensor: false});
        }, 200)
      }



      if (forceX !== 0 || forceY !== 0) {
        Body.applyForce(playerBody, playerBody.position, { x: forceX, y: forceY });
      }



      const currentVelocity = playerBody.velocity;
      const speed = Math.sqrt(currentVelocity.x ** 2 + currentVelocity.y ** 2);

      if (speed > config.maxSpeed) {
        const scale = config.maxSpeed / speed;
        Body.setVelocity(playerBody, {
          x: currentVelocity.x * scale,
          y: currentVelocity.y * scale,
        });
      }



      setRenderPosition({ x: playerBody.position.x, y: playerBody.position.y });

      setVelocity({ x: playerBody.velocity.x, y: playerBody.velocity.y });
    };


    Events.on(engine, 'afterUpdate', updateCallback);


    Runner.run(runner, engine);


    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);



    return () => {
      console.log("Cleaning up Matter.js instance");

      Runner.stop(runner);

      Events.off(engine, 'afterUpdate', updateCallback);

      Composite.clear(engine.world, false);

      Engine.clear(engine);

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);


      playerBodyRef.current = null;


    };
  }, [handleKeyDown, handleKeyUp]);


  return (
   <div> 
    <BackButton setMenuState={setMenuState} menuState={menuState}/>
    <div
      ref={sceneRef}
      style={{
        width: `${config.containerWidth}px`,
        height: `${config.containerHeight}px`,
      }}
      className="ml-[200px] border border-green-300 relative overflow-hidden bg-gray-800"
    >

      <div
        className="absolute rounded-full bg-red-500"
        style={{
          width: `${config.ballRadius * 2}px`,
          height: `${config.ballRadius * 2}px`,

          transform: `translate(${renderPosition.x - config.ballRadius}px, ${renderPosition.y - config.ballRadius}px)`,

        }}
      />
      <div
        className="absolute rounded-full bg-green-500"
        style={{
          width: `${config.ballRadius * 2}px`,
          height: `${config.ballRadius * 2}px`,

          transform: `translate(${renderEnemy.x - config.ballRadius}px, ${renderEnemy.y - config.ballRadius}px)`,

        }}
      />

      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell === 1 ? (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="absolute bg-purple-200"
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                transform: `translate(${colIndex * cellSize}px, ${rowIndex * cellSize}px)`,
              }}
            />
          ) : cell === 2 ? (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="absolute bg-green-200"
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                transform: `translate(${colIndex * cellSize}px, ${rowIndex * cellSize}px)`,
              }}
            />
          ) : null
        )
      )}

      <div className="absolute top-2 right-2 text-white text-xs font-mono">
        Velocity: X: {velocity.x.toFixed(2)}, Y: {velocity.y.toFixed(2)}
        <br />
        Position: X: {renderPosition.x.toFixed(0)}, Y: {renderPosition.y.toFixed(0)}
      </div>
      <div className="absolute bottom-96 right-24 text-white text-xs font-mono flex flex-col gap-[20px]">
        <button disabled={playerSetting.skills.skill1.isInCooldown} className={`border bg-black p-[20px] rounded-[10px] ${playerSetting.skills.skill1.isInCooldown ? "border-red-500" : "border-green-500"}`}>Skill 1: {playerSetting.skills.skill1.isInCooldown ? "In Cooldown" : "Ready"}</button>
        <button disabled={playerSetting.skills.skill2.isInCooldown} className={`border bg-black p-[20px] rounded-[10px] ${playerSetting.skills.skill2.isInCooldown ? "border-red-500" : playerSetting.skills.skill2.usedState ? "border-yellow-500" : "border-green-500"}`}>Skill 2: {playerSetting.skills.skill2.isInCooldown ? "In Cooldown" : "Ready"}</button>
        <button disabled={playerSetting.skills.skill3.isInCooldown} className={`border bg-black p-[20px] rounded-[10px] ${playerSetting.skills.skill3.isInCooldown ? "border-red-500" : "border-green-500"}`}>Skill 3: {playerSetting.skills.skill3.isInCooldown ? "In Cooldown" : "Ready"}</button>
      </div>
    </div>
   </div>
  );
}