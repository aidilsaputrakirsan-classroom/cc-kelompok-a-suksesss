import time


class CircuitBreaker:
    def __init__(self, name: str = "auth-service", failure_threshold: int = 5, cooldown_seconds: int = 30):
        self.name = name
        self.failure_threshold = failure_threshold
        self.cooldown_seconds = cooldown_seconds
        self.failure_count = 0
        self.state = "CLOSED"
        self.last_failure_time: float | None = None

    def can_execute(self) -> bool:
        if self.state == "CLOSED":
            return True

        if self.state == "OPEN":
            if self.last_failure_time is None:
                return False
            if time.monotonic() - self.last_failure_time >= self.cooldown_seconds:
                self.state = "HALF_OPEN"
                return True
            return False

        return True

    def record_success(self) -> None:
        self.failure_count = 0
        self.state = "CLOSED"
        self.last_failure_time = None

    def record_failure(self) -> None:
        self.failure_count += 1
        self.last_failure_time = time.monotonic()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
        elif self.state == "HALF_OPEN":
            self.state = "OPEN"

    def is_open(self) -> bool:
        return self.state == "OPEN"

    def status(self) -> dict:
        return {
            "name": self.name,
            "state": self.state,
            "failure_count": self.failure_count,
            "failure_threshold": self.failure_threshold,
            "cooldown_seconds": self.cooldown_seconds,
            "last_failure_time": self.last_failure_time,
        }