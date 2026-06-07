import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface UserData {
  uid: string;
  name?: string;
  email?: string;
  mobile?: string;
  provider?: string;
  photoURL?: string;
  role?: string;
  adminSecret?: string;
}

interface QueryParams {
  uid?: string;
  email?: string;
  role?: string;
}

interface UpdateFields {
  updatedAt: Date;
  role?: string;
  name?: string;
  email?: string;
  mobile?: string;
  status?: string;
  photoURL?: string;
}

// GET - সব ইউজার ফেচ করুন (Admin এর জন্য)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    const client = await clientPromise;
    const db = client.db("SolidBazaar");

    // ✅ 'any' সরানো হয়েছে
    const query: QueryParams = {};
    if (uid) query.uid = uid;
    if (email) query.email = email;
    if (role) query.role = role;

    const users = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formattedUsers = users.map((user) => ({
      ...user,
      _id: user._id.toString(),
      id: user._id.toString(),
    }));

    // Single user by UID
    if (uid && formattedUsers.length === 1) {
      return NextResponse.json(
        { success: true, user: formattedUsers[0] },
        { status: 200 },
      );
    }

    // All users
    return NextResponse.json(
      { success: true, users: formattedUsers },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

// POST - নতুন ইউজার তৈরি করুন
export async function POST(request: Request) {
  try {
    const body: UserData = await request.json();
    const {
      uid,
      name,
      email,
      mobile,
      provider,
      photoURL,
      role: requestedRole,
      adminSecret,
    } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("SolidBazaar");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ uid });

    if (existingUser) {
      // Update existing user
      const updatedUser = {
        ...existingUser,
        name: name || existingUser.name,
        email: email || existingUser.email,
        mobile: mobile || existingUser.mobile,
        photoURL: photoURL || existingUser.photoURL,
        lastLogin: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("users").updateOne({ uid }, { $set: updatedUser });

      return NextResponse.json(
        {
          success: true,
          message: "User updated successfully",
          user: updatedUser,
        },
        { status: 200 },
      );
    }

    // Check for admin creation (requires secret key)
    let userRole: "user" | "admin" = "user";
    if (requestedRole === "admin" && adminSecret === process.env.ADMIN_SECRET) {
      userRole = "admin";
    }

    // Create new user
    const newUser = {
      uid,
      name: name || "",
      email: email || "",
      mobile: mobile || "",
      provider: provider || "email",
      photoURL: photoURL || "",
      role: userRole,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      address: {
        division: "",
        district: "",
        thana: "",
        address: "",
      },
    };

    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: { ...newUser, _id: result.insertedId, id: result.insertedId },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 },
    );
  }
}

// PUT - ইউজার আপডেট করুন (role update সহ)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { uid, role, name, email, mobile, status, photoURL } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("SolidBazaar");

    // ✅ 'any' সরানো হয়েছে - টাইপ ডিফাইন করা হয়েছে
    const updateFields: UpdateFields = { updatedAt: new Date() };
    if (role) updateFields.role = role;
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (mobile) updateFields.mobile = mobile;
    if (status) updateFields.status = status;
    if (photoURL) updateFields.photoURL = photoURL;

    const result = await db
      .collection("users")
      .updateOne({ uid }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Get updated user
    const updatedUser = await db.collection("users").findOne({ uid });

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: updatedUser
          ? { ...updatedUser, _id: updatedUser._id.toString() }
          : null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 },
    );
  }
}

// DELETE - ইউজার ডিলিট করুন
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("SolidBazaar");

    const result = await db.collection("users").deleteOne({ uid });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
