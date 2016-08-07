#!/bin/bash
cd android && ./gradlew assembleRelease
./gradlew installRelease
cd ..